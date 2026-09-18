import { db } from '@appdeploy/sdk';
import { complianceForProfile } from './official-sanctions';
import { evaluateDealRisk } from './deal-risk';
import { negotiationStrategy } from './negotiation';

function num(v:any){const n=Number(v);return Number.isFinite(n)?n:0;}

async function loadTrade(user:any,tradeId:string){
  const [trade]=await db.get<any>('trades',[tradeId]);
  if(!trade)return {error:'Trade not found.',status:404};
  if(user.role!=='operator'&&trade.ownerUserId!==user.userId)return {error:'You are not authorized to access this Trade Room.',status:403};
  return {trade};
}

export async function getTradeRoom(user:any,tradeId:string){
  const loaded=await loadTrade(user,tradeId);if((loaded as any).error)return loaded;
  const trade=(loaded as any).trade;
  const [quotes,events,approvals,learning]=await Promise.all([
    db.list<any>('quotes',{limit:100}),
    db.list<any>('trade_room_events',{limit:100}),
    db.list<any>('trade_room_approvals',{limit:50}),
    db.list<any>('trade_room_learning',{limit:50})
  ]);
  const dealQuotes=quotes.items.filter((q:any)=>q.tradeId===tradeId).slice(-30).reverse();
  const dealEvents=events.items.filter((e:any)=>e.tradeId===tradeId).slice(-50).reverse();
  const dealApprovals=approvals.items.filter((a:any)=>a.tradeId===tradeId).slice(-30).reverse();
  const dealLearning=learning.items.filter((x:any)=>x.tradeId===tradeId).slice(-10).reverse();
  const risk=await evaluateDealRisk(user,{dealType:'trade',product:trade.product,payment:trade.payment,incoterm:trade.incoterm,destination:trade.destination,transactionValue:num(trade.value),documents:trade.documents||[]});
  return {trade,quotes:dealQuotes,events:dealEvents,approvals:dealApprovals,learning:dealLearning,risk,policy:'Trade Room is governed decision support. No AI action changes a trade without explicit human approval.'};
}

export async function generateTradeRoomStrategy(user:any,tradeId:string,objective:string){
  const loaded=await loadTrade(user,tradeId);if((loaded as any).error)return{ok:false,status:(loaded as any).status,message:(loaded as any).error};
  const result=await negotiationStrategy(user,tradeId,'trade',objective);
  if(!result.ok)return result;
  const strategy=result.strategy||{};
  const createdAt=new Date().toISOString();
  await db.add('trade_room_events',[{tradeId,kind:'strategy_generated',actorUserId:user.userId,actorRole:user.role,summary:String(strategy.recommendedNextAction||'Negotiation strategy generated.'),decision:String(strategy.decision||'REVIEW'),closureProbability:num(strategy.closureProbability),createdAt,metadata:{mandateReady:result.currentData?.mandateReady,costBasisReady:result.currentData?.costBasisReady}}]);
  await db.add('audit',[{userId:user.userId,action:'trade_room_strategy_generated',tradeId,createdAt}]);
  return result;
}

export async function recordTradeApproval(user:any,tradeId:string,decision:string,reason:string){
  const loaded=await loadTrade(user,tradeId);if((loaded as any).error)return{ok:false,status:(loaded as any).status,message:(loaded as any).error};
  if(!['approve','reject','escalate'].includes(decision))return{ok:false,status:400,message:'Decision must be approve, reject or escalate.'};
  const pCompliance=await complianceForProfile(user);const risk=await evaluateDealRisk(user,{dealType:'trade',product:(loaded as any).trade.product,payment:(loaded as any).trade.payment,incoterm:(loaded as any).trade.incoterm,destination:(loaded as any).trade.destination,transactionValue:num((loaded as any).trade.value),documents:(loaded as any).trade.documents||[]});
  if(decision==='approve'&&(pCompliance.screening.status!=='PRE_SCREEN_CLEAR'||risk.decision!=='ALLOW'))return{ok:false,status:423,message:'Approval is blocked until compliance and Deal Guardian both return ALLOW.',risk};
  const createdAt=new Date().toISOString();const [id]=await db.add('trade_room_approvals',[{tradeId,decision,reason:String(reason||'').slice(0,1000),approvedBy:user.userId,role:user.role,createdAt}]);if(!id)return{ok:false,status:500,message:'Unable to persist approval decision.'};
  await db.add('trade_room_events',[{tradeId,kind:'approval_decision',actorUserId:user.userId,actorRole:user.role,summary:decision.toUpperCase()+': '+String(reason||'No reason recorded.').slice(0,300),decision:decision.toUpperCase(),createdAt}]);
  await db.add('audit',[{userId:user.userId,action:'trade_room_approval_recorded',tradeId,decision,createdAt}]);
  return{ok:true,id,decision,createdAt};
}

export async function recordPostTradeLearning(user:any,tradeId:string,outcome:string,actualClosePrice:number,reason:string,notes:string){
  const loaded=await loadTrade(user,tradeId);if((loaded as any).error)return{ok:false,status:(loaded as any).status,message:(loaded as any).error};
  if(user.role!=='operator')return{ok:false,status:403,message:'Operator access required to record post-trade learning.'};
  if((loaded as any).trade.status!=='Settled')return{ok:false,status:423,message:'Post-trade learning is available after the trade is Settled.'};
  if(!['won','lost','cancelled','partial'].includes(outcome))return{ok:false,status:400,message:'Outcome must be won, lost, cancelled or partial.'};
  const createdAt=new Date().toISOString();const [id]=await db.add('trade_room_learning',[{tradeId,outcome,actualClosePrice:num(actualClosePrice),reason:String(reason||'').slice(0,500),notes:String(notes||'').slice(0,1500),recordedBy:user.userId,createdAt,learningStatus:'captured_not_auto_trained'}]);if(!id)return{ok:false,status:500,message:'Unable to persist post-trade learning.'};
  await db.add('trade_room_events',[{tradeId,kind:'post_trade_learning',actorUserId:user.userId,actorRole:user.role,summary:'Post-trade outcome captured: '+outcome,decision:'LEARNING_CAPTURED',createdAt}]);
  await db.add('audit',[{userId:user.userId,action:'post_trade_learning_captured',tradeId,outcome,createdAt}]);
  return{ok:true,id,learningStatus:'captured_not_auto_trained',createdAt};
}
