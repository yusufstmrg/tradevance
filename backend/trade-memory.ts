import { db } from '@appdeploy/sdk';

const n=(v:any)=>{const x=Number(v);return Number.isFinite(x)?x:0};
const s=(v:any)=>String(v||'').trim();
const norm=(v:any)=>s(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const safe=(v:any)=>s(v).slice(0,180);

function groupStats(items:any[],keyFn:(x:any)=>string){
  const map:Record<string,any>={};
  for(const x of items){const key=safe(keyFn(x));if(!key)continue;map[key]=map[key]||{key,tradeCount:0,totalValue:0,settled:0,won:0,lost:0};map[key].tradeCount++;map[key].totalValue+=n(x.value);if(x.status==='Settled')map[key].settled++;}
  return Object.values(map).map((x:any)=>({...x,avgValue:x.tradeCount?Math.round(x.totalValue/x.tradeCount):0})).sort((a:any,b:any)=>b.totalValue-a.totalValue);
}

export async function tradeMemorySnapshot(profile:any){
  const [trades,quotes,demands,events,approvals,learning,entities]=await Promise.all([
    db.list<any>('trades',{limit:200}),db.list<any>('quotes',{limit:200}),db.list<any>('demands',{limit:200}),
    db.list<any>('trade_room_events',{limit:200}),db.list<any>('trade_room_approvals',{limit:150}),db.list<any>('trade_room_learning',{limit:150}),db.list<any>('entities',{limit:200})
  ]);
  const allTrades=trades.items;
  const ownTrades=profile.role==='operator'?allTrades:allTrades.filter((x:any)=>x.ownerUserId===profile.userId);
  const ownQuotes=profile.role==='operator'?quotes.items:quotes.items.filter((x:any)=>x.ownerUserId===profile.userId);
  const ownDemands=profile.role==='operator'?demands.items:demands.items.filter((x:any)=>x.ownerUserId===profile.userId);
  const ownLearning=profile.role==='operator'?learning.items:learning.items.filter((x:any)=>x.recordedBy===profile.userId);
  const relevantTradeIds=new Set(ownTrades.map((x:any)=>x.id));
  const relevantEvents=events.items.filter((x:any)=>profile.role==='operator'||x.actorUserId===profile.userId||relevantTradeIds.has(x.tradeId));
  const relevantApprovals=approvals.items.filter((x:any)=>profile.role==='operator'||x.approvedBy===profile.userId||relevantTradeIds.has(x.tradeId));
  const settled=ownTrades.filter((x:any)=>x.status==='Settled');
  const won=ownLearning.filter((x:any)=>x.outcome==='won');
  const lost=ownLearning.filter((x:any)=>x.outcome==='lost');
  const avgDeal=ownTrades.length?Math.round(ownTrades.reduce((a:number,x:any)=>a+n(x.value),0)/ownTrades.length):0;
  const memorySamples=ownLearning.length;
  const coverage=ownTrades.length?Math.round(Math.min(100,(memorySamples/ownTrades.length)*100)):0;
  const productPatterns=groupStats(ownTrades,(x:any)=>x.product||'Unspecified').slice(0,10).map((x:any)=>({label:x.key,tradeCount:x.tradeCount,totalValue:x.totalValue,avgValue:x.avgValue,signal:x.tradeCount>=3?'Repeated pattern':'Early pattern'}));
  const countryPatterns=groupStats(ownTrades,(x:any)=>profile.role==='seller'?(x.buyer||'Protected Buyer'):(x.supplier||'Protected Supplier')).slice(0,10).map((x:any)=>({label:x.key,tradeCount:x.tradeCount,totalValue:x.totalValue,avgValue:x.avgValue,signal:x.tradeCount>=3?'Repeated counterparty pattern':'Early counterparty pattern'}));
  const eventCounts:Record<string,number>={};relevantEvents.forEach((e:any)=>{eventCounts[e.kind]=1+(eventCounts[e.kind]||0)});
  const approvalCounts={approve:relevantApprovals.filter((x:any)=>x.decision==='approve').length,reject:relevantApprovals.filter((x:any)=>x.decision==='reject').length,escalate:relevantApprovals.filter((x:any)=>x.decision==='escalate').length};
  const nodeMap:Record<string,any>={};const edgeMap:Record<string,any>={};
  const node=(id:string,label:string,type:string)=>{nodeMap[id]=nodeMap[id]||{id,label,type,count:0};nodeMap[id].count++};
  const edge=(source:string,target:string,kind:string)=>{const id=source+'>'+target+'>'+kind;edgeMap[id]=edgeMap[id]||{id,source,target,kind,count:0};edgeMap[id].count++};
  for(const t of ownTrades){const p='product:'+norm(t.product||'Unknown');node(p,safe(t.product||'Unknown'),'product');const cp=profile.role==='seller'?'buyer:'+norm(t.buyer||'Protected Buyer'):'supplier:'+norm(t.supplier||'Protected Supplier');node(cp,safe(profile.role==='seller'?t.buyer||'Protected Buyer':t.supplier||'Protected Supplier'),profile.role==='seller'?'buyer':'supplier');edge(p,cp,'trade');}
  const graph={nodes:Object.values(nodeMap).sort((a:any,b:any)=>b.count-a.count).slice(0,60),edges:Object.values(edgeMap).sort((a:any,b:any)=>b.count-a.count).slice(0,80)};
  const patterns=[] as any[];
  if(productPatterns[0])patterns.push({kind:'Product pattern',title:productPatterns[0].label,detail:productPatterns[0].tradeCount+' trade records · $'+productPatterns[0].totalValue.toLocaleString('en-US'),confidence:productPatterns[0].tradeCount>=3?'High':'Medium',basis:'Observed from persisted trade records'});
  if(memorySamples>=2){patterns.push({kind:'Outcome pattern',title:'Post-trade learning is accumulating',detail:won.length+' won · '+lost.length+' lost outcomes captured',confidence:'Medium',basis:'Observed from operator-recorded learning data'});}else{patterns.push({kind:'Learning coverage',title:'More trade outcomes are needed',detail:'Only '+memorySamples+' post-trade learning records are available.',confidence:'High',basis:'Insufficient data for reliable outcome patterning'});}
  if(approvalCounts.escalate>0)patterns.push({kind:'Governance pattern',title:'Some deals require escalation',detail:approvalCounts.escalate+' escalation decisions in the visible memory set.',confidence:'Medium',basis:'Observed from Trade Room approval events'});
  const recommendation=profile.role==='buyer'?(memorySamples>=2?'Use your observed supplier/product history to tighten sourcing criteria and negotiation playbooks.':'Complete a few real transactions and capture outcomes; Trade Memory becomes more useful as evidence accumulates.'):profile.role==='seller'?(memorySamples>=2?'Use your observed buyer/product history to prioritize repeatable demand and prepare stronger commercial terms.':'Keep capability, quote and outcome data current; the memory layer needs real closed-loop records to learn reliably.'):'Use Trade Memory to spot repeated product/counterparty patterns, governance friction and outcome gaps before changing policy or agent mandates.';
  return {mode:'observed-memory',profileRole:profile.role,memoryHealth:{tradeRecords:ownTrades.length,settledTrades:settled.length,learningSamples:memorySamples,coveragePercent:coverage,quoteRecords:ownQuotes.length,demandRecords:ownDemands.length,eventSignals:relevantEvents.length,approvalSignals:relevantApprovals.length},outcomes:{won:won.length,lost:lost.length,settled:settled.length,winRate:memorySamples?Math.round(won.length/memorySamples*100):null,avgDealValue:avgDeal},productPatterns,counterpartyPatterns:countryPatterns,patterns,graph,recommendation,privacy:'Role-scoped intelligence. Buyer/Seller views use only their own transaction/learning records and visible counterparties; private contacts and hidden data are never returned.',policy:'Observed and decision-support intelligence only. No autonomous model retraining or transaction execution is performed by this endpoint.'};
}
