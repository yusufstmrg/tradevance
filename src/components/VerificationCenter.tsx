import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Clock, Upload, AlertCircle, Building, FileText } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function VerificationCenter() {
  const { currentUser, userData } = useAuth();
  const [verificationState, setVerificationState] = useState('Unverified');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerification() {
      if (currentUser && userData?.organizationId) {
        const orgRef = doc(db, 'organizations', userData.organizationId);
        const orgSnap = await getDoc(orgRef);
        if (orgSnap.exists()) {
          setVerificationState(orgSnap.data().verificationStatus || 'Unverified');
        }
      }
      setLoading(false);
    }
    loadVerification();
  }, [currentUser, userData]);

  const handleRequestVerification = async () => {
    // In a real app, this would trigger a file upload to Firebase Storage and update the DB
    if (!currentUser || !userData?.organizationId) return;
    try {
      const orgRef = doc(db, 'organizations', userData.organizationId);
      await updateDoc(orgRef, { verificationStatus: 'Pending Verification' });
      setVerificationState('Pending Verification');
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [
    { level: 'Unverified', desc: 'Basic account created. Limited access to trade workflow.' },
    { level: 'Pending Verification', desc: 'Documents under review by Operator.' },
    { level: 'Registry Verified', desc: 'Business identity confirmed via public registries.' },
    { level: 'Sanctions Checked', desc: 'Screened against global trade restriction lists.' },
    { level: 'Enhanced Verified', desc: 'Full KYB and financial capability cleared.' }
  ];

  const currentStepIndex = steps.findIndex(s => s.level === verificationState) >= 0 
    ? steps.findIndex(s => s.level === verificationState) 
    : 0;

  if (loading) return <div className="text-gray-500">Loading verification status...</div>;

  return (
    <div className="bg-[#101922] rounded-xl border border-gray-800 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#d8b65c]/10 rounded-lg text-[#d8b65c]">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Verification Center</h2>
          <p className="text-sm text-gray-400">Establish trust to unlock transactions and Trade Rooms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Ladder */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Evidence Ladder</h3>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isPast = index <= currentStepIndex && verificationState !== 'Unverified';
              const isCurrent = index === currentStepIndex;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                      ${isPast || (isCurrent && verificationState !== 'Unverified') ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-gray-700 bg-gray-800 text-gray-500'}`}>
                      {(isPast && !isCurrent) || verificationState === 'Enhanced Verified' ? <CheckCircle2 size={16} /> : 
                       (isCurrent && verificationState === 'Pending Verification' ? <Clock size={16} /> : 
                       <div className="w-2 h-2 rounded-full bg-current"></div>)}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-full my-1 ${isPast ? 'bg-green-500/50' : 'bg-gray-800'}`}></div>
                    )}
                  </div>
                  <div className="pb-6">
                    <h4 className={`font-bold ${isPast || isCurrent ? 'text-white' : 'text-gray-500'}`}>{step.level}</h4>
                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#0c131b] rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center text-center">
          {verificationState === 'Unverified' ? (
            <>
              <Building size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Verify Your Business</h3>
              <p className="text-sm text-gray-400 mb-6">Upload your company registration document to start the verification process.</p>
              
              <div className="w-full max-w-sm border-2 border-dashed border-gray-700 rounded-xl p-8 mb-4 hover:border-[#d8b65c] hover:bg-[#d8b65c]/5 cursor-pointer transition-colors">
                <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                <span className="text-sm text-gray-400">Click to upload document (PDF, JPG)</span>
              </div>
              
              <button 
                onClick={handleRequestVerification}
                className="bg-[#d8b65c] text-[#070b10] px-6 py-2.5 rounded-lg font-bold hover:bg-[#e0c274] transition-colors w-full max-w-sm">
                Submit for Verification
              </button>
            </>
          ) : verificationState === 'Pending Verification' ? (
            <>
              <Clock size={64} className="text-[#d8b65c] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Review in Progress</h3>
              <p className="text-sm text-gray-400">Our compliance team is verifying your submitted documents. This usually takes 1-2 business days.</p>
            </>
          ) : (
            <>
              <ShieldCheck size={64} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Status: {verificationState}</h3>
              <p className="text-sm text-gray-400">Your organization has met the evidence requirements for this level.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
