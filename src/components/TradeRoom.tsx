import React from 'react';
import { Lock, FileText, CheckCircle2, MessageSquare, Anchor, DollarSign } from 'lucide-react';

export default function TradeRoom() {
  return (
    <div className="bg-[#070b10] flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lock className="text-[#d8b65c]" /> Secure Trade Room
          </h1>
          <p className="text-sm text-gray-400 mt-1">Governed collaboration and execution workspace.</p>
        </div>
        <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Milestones & Chat */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101922] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Execution Milestones</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30"><CheckCircle2 size={16}/></div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Commercial Agreement</h4>
                  <p className="text-xs">Quote terms accepted by both parties.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-[#d8b65c]/10 text-[#d8b65c] flex items-center justify-center border border-[#d8b65c]/30"><DollarSign size={16}/></div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Trade Finance / Payment</h4>
                  <p className="text-xs">Awaiting Xendit escrow confirmation.</p>
                </div>
                <button className="bg-[#d8b65c] text-[#070b10] px-3 py-1 rounded text-xs font-bold">Fund Escrow</button>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center border border-gray-700"><Anchor size={16}/></div>
                <div className="flex-1">
                  <h4 className="text-gray-500 font-medium">Logistics & Shipping</h4>
                  <p className="text-xs">Pending payment clearance.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#101922] border border-gray-800 rounded-xl flex flex-col h-[400px]">
            <div className="p-4 border-b border-gray-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-400"/>
              <h3 className="font-bold text-white">Governed Chat</h3>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
              <p className="text-sm">Message history is empty. Start communicating with your counterparty.</p>
            </div>
            <div className="p-4 border-t border-gray-800">
              <input type="text" className="w-full bg-[#0c131b] border border-gray-700 rounded-lg p-2.5 text-white" placeholder="Type a message (subject to compliance monitoring)..." disabled />
            </div>
          </div>
        </div>

        {/* Right Col - Documents */}
        <div className="space-y-6">
          <div className="bg-[#101922] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Trade Documents</h2>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-colors cursor-pointer mb-4">
              <FileText size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">Upload BL, Invoice, or Cert of Origin</p>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-[#0c131b] rounded-lg border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-blue-500" />
                  <span className="text-sm text-white">Sales_Contract_Draft.pdf</span>
                </div>
                <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">System Generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
