import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Plus, Search, FileText, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function RFQManager() {
  const { currentUser, userData } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ commodity: '', quantity: '', destination: '', incoterm: 'CIF' });
  const [verificationStatus, setVerificationStatus] = useState('Unverified');

  useEffect(() => {
    async function loadData() {
      if (!currentUser || !userData) return;
      
      // Load Verification
      if (userData.organizationId) {
        const orgRef = doc(db, 'organizations', userData.organizationId);
        const orgSnap = await getDoc(orgRef);
        if (orgSnap.exists()) {
          setVerificationStatus(orgSnap.data().verificationStatus || 'Unverified');
        }
      }

      // Load RFQs
      const rfqsRef = collection(db, 'rfqs');
      let q;
      if (userData.role === 'Buyer') {
        q = query(rfqsRef, where('buyerId', '==', currentUser.uid));
      } else if (userData.role === 'Seller') {
        // In a real app, match eligible sellers. For now, pull all public RFQs for this demo or where seller is eligible.
        q = query(rfqsRef, where('status', '==', 'Published'));
      } else {
        q = query(rfqsRef); // Operator sees all
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRfqs(data);
      setLoading(false);
    }
    loadData();
  }, [currentUser, userData]);

  const handleCreateRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus === 'Unverified') {
      alert("You must be at least Registry Verified to create an RFQ.");
      return;
    }
    try {
      await addDoc(collection(db, 'rfqs'), {
        ...form,
        buyerId: currentUser?.uid,
        buyerCompany: userData?.company,
        status: 'Published',
        createdAt: serverTimestamp()
      });
      setShowCreate(false);
      setForm({ commodity: '', quantity: '', destination: '', incoterm: 'CIF' });
      // Reload
      window.location.reload(); 
    } catch (error) {
      console.error("Error creating RFQ", error);
    }
  };

  if (loading) return <div className="text-gray-500">Loading opportunities...</div>;

  return (
    <div className="bg-[#070b10] flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">RFQ & Tenders</h1>
        {userData?.role === 'Buyer' && (
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#d8b65c] text-[#070b10] px-4 py-2 rounded-lg font-bold hover:bg-[#e0c274] transition-colors">
            <Plus size={18} /> Create RFQ
          </button>
        )}
      </div>

      {showCreate ? (
        <div className="bg-[#101922] border border-gray-800 p-6 rounded-xl max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Create New Demand</h2>
          <form onSubmit={handleCreateRFQ} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Commodity / Product</label>
              <input required value={form.commodity} onChange={e => setForm({...form, commodity: e.target.value})} type="text" className="w-full bg-[#0c131b] border border-gray-700 rounded-lg p-2.5 text-white" placeholder="e.g. Robusta Coffee Grade 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                <input required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} type="text" className="w-full bg-[#0c131b] border border-gray-700 rounded-lg p-2.5 text-white" placeholder="e.g. 500 MT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Incoterm</label>
                <select value={form.incoterm} onChange={e => setForm({...form, incoterm: e.target.value})} className="w-full bg-[#0c131b] border border-gray-700 rounded-lg p-2.5 text-white">
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>EXW</option>
                  <option>DDP</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Destination Port</label>
              <input required value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} type="text" className="w-full bg-[#0c131b] border border-gray-700 rounded-lg p-2.5 text-white" placeholder="e.g. Port of Rotterdam" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="bg-[#d8b65c] text-[#070b10] px-6 py-2 rounded-lg font-bold">Publish Demand</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rfqs.length === 0 ? (
            <div className="bg-[#101922] rounded-xl border border-gray-800 p-12 text-center text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-lg font-bold text-white mb-2">No Active RFQs</h2>
              <p className="text-sm">
                {userData?.role === 'Buyer' ? "You haven't created any demand yet. Click 'Create RFQ' to start sourcing." : "No eligible demands matched your profile at the moment."}
              </p>
            </div>
          ) : (
            rfqs.map(rfq => (
              <div key={rfq.id} className="bg-[#101922] border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-700 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{rfq.status}</span>
                    <span className="text-gray-500 text-xs font-mono">ID: {rfq.id.slice(0,8).toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{rfq.commodity}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Search size={14}/> {rfq.quantity}</span>
                    <span className="flex items-center gap-1.5"><ArrowRight size={14}/> {rfq.incoterm} {rfq.destination}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Buyer:</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      {userData?.role === 'Buyer' ? 'You' : rfq.buyerCompany} 
                      {userData?.role !== 'Buyer' && <ShieldCheck size={14} className="text-green-500" title="Verified Buyer"/>}
                    </span>
                  </div>
                  {userData?.role === 'Seller' && (
                    <button className="w-full md:w-auto bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      Submit Quote
                    </button>
                  )}
                  {userData?.role === 'Buyer' && (
                    <button className="w-full md:w-auto bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      View Quotes (0)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
