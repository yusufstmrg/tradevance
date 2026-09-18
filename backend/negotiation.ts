import { db, ai } from '@appdeploy/sdk';
import { evaluateDealRisk } from './deal-risk';

function num(v:any){const n=Number(v);return Number.isFinite(n)?n:0;}
function norm(v:any){return String(v||'').trim();}

async function loadDeal(user:any,dealId:string,dealType:string){
  const table=dealType==='trade'?'trades':'quotes';
  const [deal]=await db.get<any>(table,[dealId]);
  if(!deal)return null;
  if(user.role!=='operator'&&deal.ownerUserId!==user.userId)return {forbidden:true};
  const value=dealType==='quote'?num(deal.quantity)*num(deal.price):num(deal.value);
  const risk=await evaluateDealRisk(user,{dealType,product:deal.product,payment:deal.payment,incoterm:deal.incoterm,destination:deal.destination,transactionValue:value,documents:deal.documents||[]});
  const currentPrice=dealType==='quote'?num(deal.price):num(deal.unitPrice||deal.price);
  const landedCost=dealType==='quote'?num(deal.landedCost):num(deal.landedCost);
  const hasCostBasis=landedCost>0;
  const mandate={targetPrice:num(deal.targetPrice),floorPrice:num(deal.floorPrice),walkAwayPrice:num(deal.walkAwayPrice),maxConcessionPct:num(deal.maxConcessionPct)};
  const mandateReady=mandate.targetPrice>0&&mandate.floorPrice>0&&mandate.walkAwayPrice>0;
  return {deal,dealType,value,risk,currentPrice,landedCost,hasCostBasis,mandate,mandateReady};
}

export async function negotiationStrategy(user:any,dealId:string,dealType:string,objective:string='Maximize probability of closing while protecting commercial downside.'){
  const loaded=await loadDeal(user,dealId,dealType);
  if(!loaded)return {ok:false,status:404,message:'Deal not found.'};
  if((loaded as any).forbidden)return {ok:false,status:403,message:'You are not authorized to access this deal.'};
  if(loaded.risk.decision==='BLOCK')return {ok:false,status:423,message:'Negotiation strategy is blocked because the deal is BLOCKed by Tradevance Risk Engine.',risk:loaded.risk};
  const assumptions:string[]=[];
  if(!loaded.mandateReady)assumptions.push('No approved target/floor/walk-away mandate is stored on this deal. Any price bands are illustrative until a human owner approves the commercial mandate.');
  if(!loaded.hasCostBasis)assumptions.push('Acquisition cost basis is not available; margin protection cannot be validated.');
  const scenarioBase=loaded.currentPrice>0?loaded.currentPrice:0;
  const illustrative={opening:scenarioBase?Math.round(scenarioBase*1.02*100)/100:null,target:loaded.mandate.targetPrice||null,floor:loaded.mandate.floorPrice||null,walkAway:loaded.mandate.walkAwayPrice||null};
  try{
    const result=await ai.generate({
      system:'You are Tradevance Negotiation Intelligence. Produce decision support only. Never claim approval, legal clearance, guaranteed profitability, or permission to contact a counterparty. Use only the supplied deal context. Do not invent market facts. If a commercial mandate is missing, explicitly say MANDATE_REQUIRED and keep any illustrative price bands labeled as assumptions. Every material action requires human approval. Return JSON matching the schema.',
      prompt:'Objective: '+objective+'\nDeal context: '+JSON.stringify({dealType:loaded.dealType,dealId,product:loaded.deal.product,quantity:loaded.deal.quantity,unit:loaded.deal.unit,currentPrice:loaded.currentPrice,landedCost:loaded.landedCost,payment:loaded.deal.payment,incoterm:loaded.deal.incoterm,destination:loaded.deal.destination,risk:loaded.risk,mandate:loaded.mandate,mandateReady:loaded.mandateReady,costBasisReady:loaded.hasCostBasis,illustrative:illustrative,documents:loaded.deal.documents||[]}),
      schema:{type:'object',properties:{decision:{type:'string'},openingPosition:{type:'string'},targetPosition:{type:'string'},floorPosition:{type:'string'},walkAwayTrigger:{type:'string'},concessionBands:{type:'array',items:{type:'string'}},counterOfferScenarios:{type:'array',items:{type:'string'}},documentChecklist:{type:'array',items:{type:'string'}},approvalRequirements:{type:'array',items:{type:'string'}},closureProbability:{type:'number'},recommendedNextAction:{type:'string'},reasons:{type:'array',items:{type:'string'}},assumptions:{type:'array',items:{type:'string'}}},required:['decision','openingPosition','targetPosition','floorPosition','walkAwayTrigger','concessionBands','counterOfferScenarios','documentChecklist','approvalRequirements','closureProbability','recommendedNextAction','reasons','assumptions']},
      thinkingMode:'DEEP',maxTokens:1400,temperature:0.1
    });
    let parsed:any={};try{parsed=JSON.parse(result.text||'{}')}catch{parsed={error:'AI returned an unstructured strategy. No action was executed.'}}return {ok:true,dealId,dealType,risk:loaded.risk,currentData:{currentPrice:loaded.currentPrice,landedCost:loaded.landedCost,mandateReady:loaded.mandateReady,costBasisReady:loaded.hasCostBasis,illustrative},strategy:parsed,policy:'Decision support only. Human approval is required before any counter-offer, commitment, contract, payment, or transaction change.'};
  }catch{
    return {ok:false,status:502,message:'Negotiation Intelligence is temporarily unavailable. No trade or quote was changed.'};
  }
}
