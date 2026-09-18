import React, { useState } from 'react';
import {
    Activity, ShieldCheck, Target, Send, CircleDollarSign,
    BriefcaseBusiness, TrendingUp, Bot, MapPin, Search,
    Bell, CheckSquare, Clock, AlertTriangle, ArrowRight, ChevronDown
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, Line as MapLine } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mock Data for Charts
const marketData = [
    { name: 'May 22', price: 580 },
    { name: 'May 23', price: 590 },
    { name: 'May 24', price: 610 },
    { name: 'May 25', price: 605 },
    { name: 'May 26', price: 615 },
    { name: 'May 27', price: 610 },
    { name: 'May 28', price: 615 },
];

const spendData = [
    { name: 'Sulphur', value: 41, color: '#3b82f6' },
    { name: 'Caustic Soda', value: 23, color: '#8b5cf6' },
    { name: 'Carbon Black', value: 15, color: '#10b981' },
    { name: 'Industrial Salt', value: 9, color: '#f59e0b' },
    { name: 'Activated Carbon', value: 7, color: '#ec4899' },
    { name: 'Others', value: 5, color: '#6b7280' },
];

const markers = [
    { markerOffset: -15, name: "Singapore", coordinates: [103.8198, 1.3521] },
    { markerOffset: 15, name: "Tanga", coordinates: [39.1000, -5.0667] },
];

export default function CommandCenter({ data, advance }: any) {
    const total = data?.trades?.reduce((a: any, t: any) => a + t.value, 0) || 48750000;
    const active = data?.trades?.filter((t: any) => t.status !== 'Settled').length || 128;
    const openRfqs = data?.demands?.length || 32;

    return (
        <div className="flex bg-[#070b10] text-[#eef2f6] min-h-screen font-sans p-6 gap-6">
            
            {/* Main Content Column */}
            <div className="flex-1 flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, David! 👋</h1>
                        <p className="text-[#75818d] mt-2">Here's what's happening in your global trade network today.</p>
                    </div>
                    <div className="text-right text-[#75818d] text-sm">
                        <p>Thursday, May 29, 2025</p>
                        <p>GMT+7 10:30 AM</p>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-5 gap-4">
                    <MetricCard title="Active Trades" value="128" icon={Activity} trend="+18% vs last 30 days" color="text-blue-500" bg="bg-blue-500/10" />
                    <MetricCard title="Trade Value (USD)" value="$48.75M" icon={CircleDollarSign} trend="+24% vs last 30 days" color="text-green-500" bg="bg-green-500/10" />
                    <MetricCard title="Open RFQs" value="32" icon={Send} trend="+12% vs last 30 days" color="text-purple-500" bg="bg-purple-500/10" />
                    <MetricCard title="Opportunities" value="16" icon={Target} trend="+8% vs last 30 days" color="text-orange-500" bg="bg-orange-500/10" />
                    <MetricCard title="Savings Identified" value="$2.41M" icon={TrendingUp} trend="+31% vs last 30 days" color="text-yellow-500" bg="bg-yellow-500/10" />
                </div>

                {/* Map & Market Row */}
                <div className="grid grid-cols-3 gap-6 h-[400px]">
                    <div className="col-span-2 bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 z-10 relative">
                            <h3 className="font-semibold text-lg">Global Trade Map</h3>
                            <select className="bg-[#101922] border border-[#202b36] rounded-md px-3 py-1 text-sm text-[#75818d]">
                                <option>All Status</option>
                            </select>
                        </div>
                        <div className="flex-1 -mt-10">
                            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => (
                                            <Geography key={geo.rsmKey} geography={geo} fill="#1a2430" stroke="#0c131b" />
                                        ))
                                    }
                                </Geographies>
                                <MapLine from={[103.8198, 1.3521]} to={[39.1000, -5.0667]} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5,5" />
                                {markers.map(({ name, coordinates, markerOffset }) => (
                                    <Marker key={name} coordinates={coordinates as [number, number]}>
                                        <circle r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
                                        <text textAnchor="middle" y={markerOffset} style={{ fontFamily: "system-ui", fill: "#75818d", fontSize: "10px" }}>
                                            {name}
                                        </text>
                                    </Marker>
                                ))}
                            </ComposableMap>
                        </div>
                        
                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-6 left-6 bg-[#101922]/80 backdrop-blur-md border border-[#202b36] p-4 rounded-lg text-sm">
                            <p className="font-semibold mb-2">Shipments</p>
                            <div className="flex justify-between gap-4 text-[#75818d] mb-1"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>In Transit</span><span className="text-blue-500 font-medium">43</span></div>
                            <div className="flex justify-between gap-4 text-[#75818d] mb-1"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Loading</span><span className="text-yellow-500 font-medium">12</span></div>
                            <div className="flex justify-between gap-4 text-[#75818d] mb-1"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Delivered</span><span className="text-green-500 font-medium">28</span></div>
                            <div className="flex justify-between gap-4 text-[#75818d]"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span>Delayed</span><span className="text-red-500 font-medium">5</span></div>
                        </div>
                    </div>

                    <div className="col-span-1 bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Market Overview</h3>
                            <select className="bg-[#101922] border border-[#202b36] rounded-md px-2 py-1 text-xs text-[#75818d]">
                                <option>Sulphur (Granular)</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold">$615.00</h2>
                            <span className="text-green-500 text-sm font-medium">↗ 2.45% (15.00)</span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={marketData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#202b36" vertical={false} />
                                    <XAxis dataKey="name" stroke="#75818d" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} stroke="#75818d" fontSize={10} tickLine={false} axisLine={false} width={30} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#101922', borderColor: '#202b36', borderRadius: '8px' }} itemStyle={{ color: '#eef2f6' }} />
                                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#0c131b', stroke: '#3b82f6', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between mt-4">
                            {['1D', '1W', '1M', '3M', '1Y'].map(t => (
                                <button key={t} className={`px-3 py-1 text-xs rounded-md ${t === '1W' ? 'bg-[#202b36] text-white' : 'text-[#75818d] hover:bg-[#101922]'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Grids */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Active Trades Table */}
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Active Trades</h3>
                            <button className="text-blue-500 text-sm hover:underline">View all</button>
                        </div>
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[#75818d] border-b border-[#202b36]">
                                    <tr>
                                        <th className="pb-3 font-medium">Trade ID</th>
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 font-medium">Buyer</th>
                                        <th className="pb-3 font-medium">Qty (MT)</th>
                                        <th className="pb-3 font-medium">Value (USD)</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#202b36]/50">
                                        <td className="py-3 text-blue-400">TRD-2025-00085</td>
                                        <td className="py-3">Sulphur (Granular)</td>
                                        <td className="py-3">PT Indo Fertilizer</td>
                                        <td className="py-3">50,000</td>
                                        <td className="py-3">$30,750,000</td>
                                        <td className="py-3"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Negotiation</span></td>
                                    </tr>
                                    <tr className="border-b border-[#202b36]/50">
                                        <td className="py-3 text-blue-400">TRD-2025-00084</td>
                                        <td className="py-3">Caustic Soda</td>
                                        <td className="py-3">ABC Chemical Ltd</td>
                                        <td className="py-3">25,000</td>
                                        <td className="py-3">$12,875,000</td>
                                        <td className="py-3"><span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs">In Transit</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Opportunities */}
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Top Opportunities</h3>
                            <button className="text-blue-500 text-sm hover:underline">View all</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { prod: "50,000 MT Sulphur", route: "CIF Dar es Salaam", margin: "$1.2M", fit: "High", color: "text-green-500", bg: "bg-green-500/10" },
                                { prod: "30,000 MT Caustic Soda", route: "CIF Mombasa", margin: "$780K", fit: "High", color: "text-green-500", bg: "bg-green-500/10" },
                                { prod: "20,000 MT Carbon Black", route: "CIF Chittagong", margin: "$560K", fit: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/10" }
                            ].map((opp, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[#202b36] bg-[#101922]">
                                    <div className="w-10 h-10 rounded-lg bg-[#1a2430] flex items-center justify-center text-[#d4ad50]">
                                        <Target size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{opp.prod}</p>
                                        <p className="text-xs text-[#75818d]">{opp.route}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-[#75818d]">Margin est. {opp.margin}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded ${opp.bg} ${opp.color}`}>{opp.fit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* 3 Columns Row */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Agents */}
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">AI Agents Status</h3>
                            <button className="text-blue-500 text-sm hover:underline">View all</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { name: "Procurement Agent", status: "Active" },
                                { name: "Verification Agent", status: "Active" },
                                { name: "Pricing Agent", status: "Active" }
                            ].map(a => (
                                <div key={a.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <Bot size={14} className="text-[#d4ad50]" />
                                        <span>{a.name}</span>
                                    </div>
                                    <span className="text-green-500 text-xs px-2 py-1 rounded bg-green-500/10">{a.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spend Analytics */}
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                        <h3 className="font-semibold text-lg mb-4">Spend Analytics</h3>
                        <div className="flex items-center gap-4 h-32">
                            <div className="w-1/2 h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={spendData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                            {spendData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-[#75818d]">Total Spend</span>
                                    <span className="text-sm font-bold">$48.75M</span>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-1 text-[10px]">
                                {spendData.slice(0, 4).map(s => (
                                    <div key={s.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                                            <span className="text-[#75818d]">{s.name}</span>
                                        </div>
                                        <span>{s.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Freight Insight */}
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Freight Market Insight</h3>
                            <button className="text-blue-500 text-sm hover:underline">View all</button>
                        </div>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-[#75818d]">Singapore → Tanga</span>
                                <div className="flex gap-3 items-center"><span>$32 /MT</span><span className="text-red-500 flex items-center text-xs"><TrendingUp size={12}/> 4%</span></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#75818d]">Middle East → Tanga</span>
                                <div className="flex gap-3 items-center"><span>$25 /MT</span><span className="text-green-500 flex items-center text-xs"><TrendingUp size={12} className="rotate-180"/> 2%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] flex flex-col gap-6">
                
                {/* AI Copilot */}
                <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col h-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles size={16} className="text-[#d4ad50]"/> AI Copilot</h3>
                        <span className="flex items-center gap-1 text-green-500 text-xs"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
                    </div>
                    <div className="bg-[#101922] border border-[#202b36] rounded-lg p-4 flex-1 mb-4">
                        <p className="font-medium text-sm mb-3">What can I help you with today?</p>
                        <p className="text-xs text-[#75818d] mb-4">Ask anything about global trade, market, suppliers, or your transactions...</p>
                        <div className="flex flex-col gap-2">
                            <button className="text-left text-xs bg-[#1a2430] border border-[#2b3743] rounded px-3 py-2 text-[#aab4be] hover:bg-[#202b36]">Find suppliers for 50,000 MT Sulphur</button>
                            <button className="text-left text-xs bg-[#1a2430] border border-[#2b3743] rounded px-3 py-2 text-[#aab4be] hover:bg-[#202b36]">Market trend for Caustic Soda</button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Ask Tradevance AI..." className="w-full bg-[#101922] border border-[#202b36] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6]" />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75818d] hover:text-white"><Send size={14}/></button>
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">Alerts</h3>
                        <button className="text-blue-500 text-sm hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <AlertItem icon={AlertTriangle} title="Shipment Delay" desc="Shipment TRD-2025-00076 delayed at Port Klang" time="10 min ago" color="text-red-500" />
                        <AlertItem icon={TrendingUp} title="Price Alert" desc="Sulphur price increased by 2.45%" time="1 hr ago" color="text-yellow-500" />
                        <AlertItem icon={ShieldCheck} title="Compliance Alert" desc="Sanctions screening found 2 high-risk matches" time="3 hr ago" color="text-red-500" />
                    </div>
                </div>

                {/* My Tasks */}
                <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">My Tasks</h3>
                        <button className="text-blue-500 text-sm hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <TaskItem title="Approve Contract" sub="TRD-2025-00085" priority="High" pColor="text-red-500" due="Due in 2h" />
                        <TaskItem title="Review RFQ Responses" sub="RFQ-2025-00124" priority="Medium" pColor="text-yellow-500" due="Due today" />
                        <TaskItem title="Verify Supplier Documents" sub="SUP-2025-00456" priority="Low" pColor="text-green-500" due="Due in 2 days" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, color, bg }: any) {
    return (
        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[#75818d] text-sm">{title}</span>
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                <p className={`text-xs mt-1 ${color}`}>{trend}</p>
            </div>
        </div>
    );
}

function AlertItem({ icon: Icon, title, desc, time, color }: any) {
    return (
        <div className="flex gap-3">
            <div className={`mt-0.5 ${color}`}><Icon size={14} /></div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#eef2f6]">{title}</span>
                    <span className="text-[10px] text-[#75818d]">{time}</span>
                </div>
                <p className="text-xs text-[#75818d] leading-snug">{desc}</p>
            </div>
        </div>
    );
}

function TaskItem({ title, sub, priority, pColor, due }: any) {
    return (
        <div className="flex gap-3 items-start border-b border-[#202b36] pb-3 last:border-0 last:pb-0">
            <div className="mt-1 text-[#75818d]"><CheckSquare size={14} /></div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#eef2f6]">{title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded bg-[#101922] border border-[#202b36] ${pColor}`}>{priority}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-[#75818d]">{sub}</p>
                    <p className="text-[10px] text-[#75818d]">{due}</p>
                </div>
            </div>
        </div>
    );
}
