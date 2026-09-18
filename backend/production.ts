import { db } from '@appdeploy/sdk';

const demoDemandIds=['RFQ-2026-001','RFQ-2026-002','RFQ-2026-003'];
const demoTradeIds=['TRD-2026-0084','TRD-2026-0083','TRD-2026-0082','TRD-2026-0081'];

function productFit(a:string,b:string){const aa=a.toLowerCase().split(/\s+/).filter(Boolean);const bb=b.toLowerCase();return aa.some(x=>bb.includes(x));}
function entityScore(x:any){return Math.max(0,Math.min(100,Number(x.confidence||70)+(String(x.verificationLevel||'').toLowerCase().includes('trade verified')?4:0)+(x.evidence?.length>=2?3:0)));}
function entityToCompact(x:any){return{id:x.id,name:x.name,country:x.country,products:x.products||[],verification:x.verificationLevel,confidence:entityScore(x),notes:x.notes||''};}

export async function trustGraphSnapshot(){await ensureProductionMode();const [eRows,dRows]=await Promise.all([db.list<any>('entities',{limit:200}),db.list<any>('demands',{limit:200})]);const entities=eRows.items;const demands=dRows.items;const verificationWeight=(v:string)=>{const s=String(v||'').toLowerCase();if(s.includes('fully kyb'))return 20;if(s.includes('trade verified'))return 18;if(s.includes('evidence-backed'))return 15;if(s.includes('source verified'))return 12;return 5;};const daysSince=(v:string)=>{const t=Date.parse(v||'');if(!Number.isFinite(t))return 999;return Math.max(0,Math.floor((Date.now()-t)/86400000));};const productFit=(a:string,b:string)=>String(a).toLowerCase().split(/\s+/).filter(Boolean).some(x=>String(b).toLowerCase().includes(x));const nodes=entities.map((e:any)=>{const evidence=Array.isArray(e.evidence)?e.evidence:[];const types=new Set(evidence.map((x:any)=>x.type).filter(Boolean));const relations=demands.filter((d:any)=>String(d.buyer||'').toLowerCase()===String(e.name||'').toLowerCase()||e.entityType==='Seller'&&String(d.product||'')&&((e.products||[]).some((p:string)=>productFit(String(d.product),p)))).length;const identity=(e.name&&e.country?12:6)+(e.officialUrl?8:0);const evidenceScore=Math.min(25,evidence.length*7+types.size*3);const verification=verificationWeight(e.verificationLevel);const age=daysSince(e.lastVerified);const freshness=age<=30?10:age<=90?6:age<=180?3:0;const corroboration=Math.min(10,(types.size>=2?6:3)+(evidence.length>=3?4:0));const operational=Math.min(15,relations>0?15:5);const trustScore=Math.round(Math.min(100,identity+evidenceScore+verification+freshness+corroboration+operational));const riskBand=trustScore>=85?'Low':trustScore>=70?'Medium':'High';const reasons=[] as string[];if(identity>=18)reasons.push('Strong identity');if(evidenceScore>=18)reasons.push('Multiple evidence');if(verification>=18)reasons.push('Trade-level verification');if(freshness>=10)reasons.push('Fresh evidence');if(relations>0)reasons.push('Operational relationship');if(!reasons.length)reasons.push('Limited evidence');return{id:e.id,name:e.name,entityType:e.entityType,country:e.country,trustScore,riskBand,evidenceDepth:evidence.length,freshnessDays:age,relationshipCount:relations,reasons};});const edges=nodes.reduce((acc:any[],n:any)=>{const entity=entities.find((x:any)=>x.id===n.id);for(const ev of Array.isArray(entity?.evidence)?entity.evidence:[])if(ev.sourceUrl)acc.push({from:n.id,to:String(ev.sourceUrl),type:'evidence_source'});for(const d of demands){const buyerMatch=String(d.buyer||'').toLowerCase()===String(n.name||'').toLowerCase();const sellerMatch=n.entityType==='Seller'&&String(d.product||'')&&((entity?.products||[]).some((p:string)=>productFit(String(d.product),p)));if(buyerMatch||sellerMatch)acc.push({from:n.id,to:String(d.id),type:buyerMatch?'buyer_demand':'seller_fit'});}return acc;},[]);const avgTrust=Math.round(nodes.reduce((a:any,n:any)=>a+n.trustScore,0)/Math.max(1,nodes.length));const reviewQueue=nodes.filter(n=>n.riskBand==='High'||n.freshnessDays>90||n.evidenceDepth<2).sort((a,b)=>a.trustScore-b.trustScore).slice(0,20);const relationCounts=edges.reduce((m:any,e:any)=>{m[e.type]=(m[e.type]||0)+1;return m},{});return{nodesCount:nodes.length,edgesCount:edges.length,avgTrust,scoreBuckets:{low:nodes.filter(n=>n.riskBand==='Low').length,medium:nodes.filter(n=>n.riskBand==='Medium').length,high:nodes.filter(n=>n.riskBand==='High').length},staleNodes:nodes.filter(n=>n.freshnessDays>90).length,avgEvidenceDepth:Math.round(nodes.reduce((a:any,n:any)=>a+n.evidenceDepth,0)/Math.max(1,nodes.length)*10)/10,relationCounts,reviewQueue,nodes:nodes.sort((a,b)=>b.trustScore-a.trustScore).slice(0,50)};}

async function ensureProductionMode(){
 const m=await db.list<any>('meta',{limit:1});
 const current=m.items[0];
 const version='production-2026-08-21';
 if(!current){
  await db.add('meta',[{mode:'production',dataVersion:version,ownerUserId:null}]);
 }else if(current.mode!=='production'||current.dataVersion!==version){
  await db.update('meta',[{id:current.id,record:{...current,mode:'production',dataVersion:version}}]);
 }
 const [demands,trades,quotes]=await Promise.all([
  db.list<any>('demands',{limit:200}),
  db.list<any>('trades',{limit:200}),
  db.list<any>('quotes',{limit:200})
 ]);
 const demandIds=demands.items.filter(x=>demoDemandIds.includes(String(x.id))).map(x=>x.id);
 const tradeIds=trades.items.filter(x=>demoTradeIds.includes(String(x.id))).map(x=>x.id);
 const quoteIds=quotes.items.filter(x=>demoTradeIds.includes(String(x.tradeId))).map(x=>x.id);
 if(demandIds.length)await db.delete('demands',demandIds);
 if(tradeIds.length)await db.delete('trades',tradeIds);
 if(quoteIds.length)await db.delete('quotes',quoteIds);
}

export async function liveOpportunityContext(){
 await ensureProductionMode();
 const [dRows,eRows]=await Promise.all([db.list<any>('demands',{limit:200}),db.list<any>('entities',{limit:200})]);
 const demands=dRows.items;
 const entities=eRows.items;
 const sellers=entities.filter(x=>x.entityType==='Seller');
 const buyers=entities.filter(x=>x.entityType==='Buyer');
 const opportunities=demands.flatMap(d=>{
  const matches=sellers.filter(s=>(d.product||'')&&((s.products||[]).some((p:string)=>productFit(String(d.product),p))));
  return matches.slice(0,8).map(s=>{
   const fit=entityScore(s); const quantity=Number(d.quantity||0); const valueHint=Number(d.estimatedValue||0);
   const score=Math.round(Math.min(100,Math.max(0,(fit*0.65)+(quantity>0?18:8)+(d.incoterm?8:0)+(d.payment?6:0))));
   return{id:'live-'+d.id+'-'+s.id,sourceDemandId:d.id,product:d.product||'Unspecified',buyer:d.buyer||'Verified buyer account',supplier:s.name,origin:s.country||'To confirm',destination:d.destination||'To confirm',quantity,estimatedValue:valueHint,opportunityScore:score,trust:fit,supplyFit:fit,demandStrength:d.confidence||0,risk:Math.max(5,100-fit),reasons:['Live RFQ record','Evidence-backed supplier profile',d.incoterm?'Incoterm specified':'Incoterm pending']};
  });
 }).sort((a,b)=>b.opportunityScore-a.opportunityScore).slice(0,30);
 return{demands,buyers:buyers.map(entityToCompact),sellers:sellers.map(entityToCompact),opportunities};
}

export async function liveRadar(){
 const ctx=await liveOpportunityContext();
 const demandRadar=ctx.demands.slice(0,20).map((d:any,i:number)=>({id:'d-'+d.id,name:d.buyer||'Verified buyer account',product:d.product||'Unspecified',country:d.destination||'To confirm',signal:'Live procurement record in Tradevance',strength:Math.min(100,Math.max(20,Number(d.confidence||70))),lastSignal:d.createdAt||'Current'}));
 const supplyRadar=ctx.sellers.slice(0,20).map((s:any)=>({id:'s-'+s.id,name:s.name,product:s.products.join(' · '),country:s.country,signal:'Evidence-backed supplier profile in operational registry',strength:s.confidence,lastSignal:'Current'}));
 return{demandRadar,supplyRadar,opportunities:ctx.opportunities};
}
