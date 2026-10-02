import { db } from '@appdeploy/sdk';
import { liveOpportunityContext } from './production';
import { evaluateCounterpartyRisk } from './risk';
import { evaluateDealRisk } from './deal-risk';
import { tradeMemorySnapshot } from './trade-memory';

const num=(x:any)=>Number.isFinite(Number(x))?Number(x):0;

export async function decisionMesh(p:any){
  const memory=await tradeMemorySnapshot(p);
  const live=await liveOpportunityContext();
  const allProfiles=(await db.list<any>('profiles',{limit:300})).items;
  const ownQuotes=(await db.list<any>('quotes',{limit:100})).items.filter((x:any)=>p.role==='operator'||x.ownerUserId===p.userId);
  const ownTrades=(await db.list<any>('trades',{limit:100})).items.filter((x:any)=>p.role==='operator'||x.ownerUserId===p.userId);
  const cards:any[]=[];
  if(p.role==='operator'){
    for(const opp of live.opportunities.slice(0,8)){
      const buyer=allProfiles.find((x:any)=>(x.company||x.name||'')===opp.buyer);
      const risk=buyer?await evaluateCounterpartyRisk(buyer,{transactionValue:opp.estimatedValue,product:opp.product,destination:opp.destination}):null;
      const decision=risk?.decision==='BLOCK'?'BLOCK':risk?.decision==='REVIEW'?'REVIEW':opp.opportunityScore>=85?'ALLOW':'REVIEW';
      cards.push({id:opp.id,type:'Opportunity',title:opp.product,subtitle:(opp.buyer||'Buyer')+' → '+(opp.supplier||'Supplier'),priority:decision==='BLOCK'?'critical':decision==='REVIEW'?'high':'medium',decision,score:opp.opportunityScore,why:(risk?.reasons||opp.reasons||[]).slice(0,3),evidence:['Live RFQ opportunity','Evidence-backed entity record'],dataQuality:opp.demandStrength>=70?'strong':'moderate',nextAction:decision==='BLOCK'?'Resolve risk/compliance blockers':decision==='REVIEW'?'Review risk and evidence':'Open sourcing opportunity',destination:'Intelligence',confidence:Math.max(60,Math.min(97,opp.opportunityScore))});
    }
    for(const q of ownQuotes.slice(-6).reverse()){
      const profile=allProfiles.find((x:any)=>x.userId===q.ownerUserId);if(!profile)continue;
      const value=num(q.quantity)*num(q.price);const risk=await evaluateDealRisk(profile,{dealType:'quote',product:q.product,payment:q.payment,incoterm:q.incoterm,destination:q.destination,transactionValue:value,documents:q.documents||[]});
      cards.push({id:q.id,type:'Quote',title:q.product||'Quote',subtitle:profile.company||profile.name||'Quote owner',priority:risk.decision==='BLOCK'?'critical':risk.decision==='REVIEW'?'high':'medium',decision:risk.decision,score:risk.riskScore,why:risk.reasons.slice(0,3),evidence:['Persisted quote','Deal Guardian risk evaluation'],dataQuality:Array.isArray(q.documents)&&q.documents.length?'strong':'thin',nextAction:risk.decision==='BLOCK'?'Resolve blockers':risk.decision==='REVIEW'?'Complete manual deal review':'Prepare next approved step',destination:'Trade Room',confidence:Math.max(60,100-risk.riskScore)});
    }
  }else{
    const roleOpportunities=live.opportunities.filter((x:any)=>p.role==='buyer'?x.buyer: true).slice(0,6);
    for(const opp of roleOpportunities){
      const visibleTitle=p.role==='buyer'?(opp.supplier||'Qualified supplier'):(opp.product||'Qualified demand');
      cards.push({id:opp.id,type:p.role==='buyer'?'Supplier Opportunity':'Buyer Opportunity',title:visibleTitle,subtitle:p.role==='buyer'?(opp.product||'Product'):(opp.destination||'Destination to confirm'),priority:opp.opportunityScore>=88?'high':'medium',decision:'RECOMMEND',score:opp.opportunityScore,why:opp.reasons.slice(0,3),evidence:['Live procurement signal','Evidence-backed visible entity'],dataQuality:opp.demandStrength>=70?'strong':'moderate',nextAction:p.role==='buyer'?'Review supplier shortlist':'Review matched buyer demand',destination:p.role==='buyer'?'Buyer Workspace':'Seller Workspace',confidence:opp.opportunityScore});
    }
    for(const t of ownTrades.slice(-4).reverse()){
      const risk=await evaluateCounterpartyRisk(p,{transactionValue:num(t.value),product:t.product,destination:t.destination});
      cards.push({id:t.id,type:'Trade',title:t.product||'Active trade',subtitle:t.status||'In progress',priority:risk.decision==='BLOCK'?'critical':risk.decision==='REVIEW'?'high':'medium',decision:risk.decision,score:risk.riskScore,why:risk.reasons.slice(0,3),evidence:['Persisted trade record','Counterparty risk evaluation'],dataQuality:Array.isArray(t.documents)&&t.documents.length?'strong':'thin',nextAction:risk.decision==='BLOCK'?'Resolve blockers':risk.decision==='REVIEW'?'Complete review':'Open Trade Room',destination:'Trade Room',confidence:Math.max(55,100-risk.riskScore)});
    }
  }
  const priorityOrder={critical:0,high:1,medium:2,low:3};cards.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]||b.score-a.score);
  const summary={urgent:cards.filter(x=>x.priority==='critical').length,review:cards.filter(x=>x.decision==='REVIEW').length,recommended:cards.filter(x=>x.decision==='RECOMMEND'||x.decision==='ALLOW').length,signals:cards.length,memorySamples:memory.memoryHealth.learningSamples};
  return {generatedAt:new Date().toISOString(),role:p.role,summary,cards:cards.slice(0,12),memory:memory.memoryHealth,principles:['Decision support, not autonomous execution.','Observed data is separated from inference.','Role-scoped visibility is enforced.','REVIEW/BLOCK remains non-transactional.'],policy:'The Decision Mesh only recommends or routes to governed workspaces. It cannot approve, send, contract, pay, or execute a trade.'};
}
