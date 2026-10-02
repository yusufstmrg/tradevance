import { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { Activity, ArrowRight, BrainCircuit, CircleDollarSign, GitBranch, PackageSearch, ShieldCheck, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import './trade-memory.css';

export default function TradeMemory(){
 const [data,setData]=useState<any>(null); const [loading,setLoading]=useState(true); const [err,setErr]=useState('');
 useEffect(()=>{(async()=>{try{const r=await api.get('/api/trade-memory');setData(r.data);}catch{setErr('Trade Memory is temporarily unavailable. No trade data was changed.');}finally{setLoading(false);}})();},[]);
 const graphDensity=useMemo(()=>{if(!data?.graph?.nodes?.length)return 0;return Math.min(100,Math.round((data.graph.edges.length/data.graph.nodes.length)*18));},[data]);
 if(loading)return <div className='page-head'><div><div className='eyebrow'><BrainCircuit size={14}/> TRADEVANCE MEMORY</div><h2>Building your trade memory…</h2><p>Reading only persisted RFQ, quote, trade and post-trade records.</p></div></div>;
 if(err)return <div className='admin-error'>{err}</div>;
 return <>
  <div className='page-head'><div><div className='eyebrow'><BrainCircuit size={14}/> TRADE MEMORY GRAPH</div><h2>Turn every real trade into better intelligence.</h2><p>Observed patterns from your persisted trade history — not synthetic activity, not hidden data, and not automatic model training.</p></div><div className='memory-header-actions'><span className='memory-badge'><Sparkles size={13}/> Observed data only</span></div></div>
  <div className='memory-hero'><div className='memory-hero-copy'><small>WHY THIS MATTERS</small><h3>{data.recommendation}</h3><p>Trade Memory connects products, counterparties, approvals and outcomes so the platform can explain what keeps repeating — and where evidence is still too thin.</p></div><div className='memory-orb'><GitBranch size={38}/><span>{data.graph.nodes.length} nodes · {data.graph.edges.length} relationships</span></div></div>
  <div className='metric-grid memory-metrics'>
   <Metric title='Trade records' value={String(data.memoryHealth.tradeRecords)} sub='persisted transactions' icon={Activity}/>
   <Metric title='Learning samples' value={String(data.memoryHealth.learningSamples)} sub='post-trade outcomes' icon={BrainCircuit}/>
   <Metric title='Memory coverage' value={data.memoryHealth.coveragePercent+'%'} sub='trades with captured outcome' icon={ShieldCheck}/>
   <Metric title='Average deal value' value={'$'+Number(data.outcomes.avgDealValue||0).toLocaleString('en-US')} sub='observed trade history' icon={CircleDollarSign}/>
   <Metric title='Graph density' value={graphDensity+'%'} sub='relationship richness' icon={GitBranch}/>
  </div>
  <div className='grid-2 memory-grid'>
   <section className='panel memory-panel'><PanelTitle title='Observed patterns' subtitle='Signals the memory layer can support today' icon={TrendingUp}/><div className='memory-list'>{data.patterns.map((x:any)=><div className='memory-row' key={x.kind+x.title}><div className='memory-row-icon'><Sparkles size={14}/></div><div><b>{x.title}</b><span>{x.detail}</span><small>{x.basis}</small></div><label>{x.confidence}</label></div>)}</div></section>
   <section className='panel memory-panel'><PanelTitle title='Outcome picture' subtitle='What the stored learning records actually say' icon={Target}/><div className='outcome-grid'><div><b>{data.outcomes.won}</b><span>Won</span></div><div><b>{data.outcomes.lost}</b><span>Lost</span></div><div><b>{data.outcomes.settled}</b><span>Settled</span></div><div><b>{data.outcomes.winRate===null?'—':data.outcomes.winRate+'%'}</b><span>Win rate</span></div></div><div className='memory-note'><ShieldCheck size={15}/><span>Win rate is shown only when operator-recorded learning samples exist.</span></div></section>
  </div>
  <div className='grid-2 memory-grid'>
   <section className='panel memory-panel'><PanelTitle title='Product patterns' subtitle='Repeated products in the visible trade history' icon={PackageSearch}/><div className='pattern-table'>{data.productPatterns.length?data.productPatterns.map((x:any)=><div className='pattern-line' key={x.label}><div><b>{x.label}</b><span>{x.signal}</span></div><strong>{x.tradeCount} trades</strong><small>${Number(x.totalValue||0).toLocaleString('en-US')} value</small></div>):<div className='empty-state'>No product pattern yet. Real trade history will populate this layer.</div>}</div></section>
   <section className='panel memory-panel'><PanelTitle title={data.profileRole==='seller'?'Buyer patterns':'Supplier patterns'} subtitle='Role-scoped counterparties only' icon={Users}/><div className='pattern-table'>{data.counterpartyPatterns.length?data.counterpartyPatterns.map((x:any)=><div className='pattern-line' key={x.label}><div><b>{x.label}</b><span>{x.signal}</span></div><strong>{x.tradeCount} trades</strong><small>${Number(x.totalValue||0).toLocaleString('en-US')} value</small></div>):<div className='empty-state'>No counterparty pattern yet. This section fills from your own persisted trade history.</div>}</div></section>
  </div>
  <section className='panel memory-graph-panel'><PanelTitle title='Relationship map' subtitle='Products connected to visible counterparties through persisted trade records' icon={GitBranch}/><div className='graph-strip'>{data.graph.nodes.slice(0,18).map((x:any)=><div className={'graph-node '+x.type} key={x.id}><span>{x.type==='product'?<PackageSearch size={14}/>:x.type==='buyer'||x.type==='supplier'?<Users size={14}/>:<GitBranch size={14}/>}</span><b>{x.label}</b><small>{x.count} observed link{x.count===1?'':'s'}</small></div>)}</div><div className='memory-policy'><ShieldCheck size={14}/><span>{data.privacy}</span></div></section>
 </>;
}
function Metric({title,value,sub,icon:Icon}:any){return <div className='metric'><div className='metric-icon'><Icon size={17}/></div><small>{title}</small><strong>{value}</strong><span>{sub}</span></div>}
function PanelTitle({title,subtitle,icon:Icon}:any){return <div className='panel-title'><div className='title-icon'><Icon size={16}/></div><div><h3>{title}</h3><p>{subtitle}</p></div></div>}
