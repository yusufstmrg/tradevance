import { auth as fbAuth, db } from './firebase';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;

const isFirebaseReady = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';

export const auth = {
    getUser: async () => {
        if (isFirebaseReady) {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
                    unsubscribe();
                    resolve(user ? { id: user.uid, email: user.email } : null);
                });
            });
        }
        return null; // Mock no user initially
    },
    signIn: async () => {
        if (isFirebaseReady) {
            // Note: Replace with real credentials in production
            const credential = await signInWithEmailAndPassword(fbAuth, 'test@tradevance.com', 'password123');
            return { user: { id: credential.user.uid, email: credential.user.email } };
        }
        return { user: { id: 'test-user', email: 'test@example.com' } };
    },
    signOut: async () => {
        if (isFirebaseReady) {
            await fbSignOut(fbAuth);
            return true;
        }
        return true;
    }
};

export const api = {
    get: async (url: string) => {
        console.log(`API GET: ${url}`);
        if (isFirebaseReady) {
            try {
                if (url === '/api/auth/me' || url === '/api/me') {
                    return { data: { role: 'Buyer', company: 'Firebase Co.', name: 'Firebase User', avatarUrl: '' } };
                }
                if (url === '/api/bootstrap') {
                    const demandsSnap = await getDocs(collection(db, 'demands'));
                    const demands = demandsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    return { data: { suppliers: [], buyers: [], demands, trades: [] } };
                }
            } catch (e) {
                console.warn('Firebase query failed, falling back to mock.', e);
            }
        }
        
        // Mock Fallback
        if (url === '/api/auth/me' || url === '/api/me') {
            return { data: { role: 'pending', company: '', name: 'Test User', avatarUrl: '' } };
        }
        if (url === '/api/bootstrap') {
            return { data: { suppliers: [], buyers: [], demands: [], trades: [] } };
        }
        if (url === '/api/execution') {
             return { data: { 
                 trades: [{ id: 'TRD-10293', product: 'Caustic Soda', buyer: 'MNC Chem', supplier: 'Sino Alkali', qty: 25000, value: 12375000, status: 'Negotiation', risk: 22 }],
                 quotes: [{ id: 'Q-01', tradeId: 'TRD-10293', supplier: 'Sino Alkali', product: 'Caustic Soda', quantity: 25000, currency: 'USD', unit: 'MT', price: 495, freight: 28, insurance: 3, landedCost: 526, payment: 'Confirmed DLC at sight', incoterm: 'CIF', status: 'Pending' }] 
             } };
        }
        if (url.startsWith('/api/trade-room/')) {
            return { data: { events: [{ id: '1', kind: 'Room Opened', summary: 'Trade room initialized', createdAt: new Date().toISOString() }] } };
        }
        return { data: {} };
    },
    post: async (url: string, data: any) => {
        console.log(`API POST: ${url}`, data);
        if (isFirebaseReady) {
            try {
                if (url === '/api/demands') {
                    const docRef = await addDoc(collection(db, 'demands'), { ...data, status: 'Open', createdAt: Timestamp.now() });
                    return { data: { id: docRef.id, ...data, status: 'Open' } };
                }
            } catch (e) {
                console.warn('Firebase write failed, falling back to mock.', e);
            }
        }

        // Mock Fallback
        if (url === '/api/profile' || url === '/api/auth/test-login') {
            return { data: { role: data.role || 'Buyer', company: data.company || 'Test Co', name: 'Test User' } };
        }
        if (url === '/api/ai/parse-demand') {
            if (ai) {
                try {
                    const prompt = `Act as an expert commodities procurement AI.
Parse the following buyer demand text into a structured JSON object.
Demand text: "${data.text}"
Your output MUST be a valid JSON object with the following keys:
- "product": (string) The commodity name.
- "quantity": (number) The numerical quantity.
- "unit": (string) The unit of measurement (e.g. MT, BBL).
- "destination": (string) The port or location of delivery.
- "incoterm": (string) The incoterm (e.g. CIF, FOB).
- "payment": (string) Payment terms (e.g. DLC at sight).
- "delivery": (string) Delivery window or month.
- "quality": (string) Any quality or specification notes.
- "confidence": (number) How confident you are in this parsing (0-100).`;
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: { responseMimeType: 'application/json' }
                    });
                    return { data: JSON.parse(response.text || '{}') };
                } catch (e) {
                    console.error("Gemini AI failed for parsing", e);
                }
            }
            return { data: { product: 'Sulphur', quantity: 50000, unit: 'MT', destination: 'Tanga', incoterm: 'CIF', payment: 'DLC at sight', delivery: 'September', quality: 'Standard', confidence: 92 } };
        }
        if (url === '/api/match') {
            return { data: { matches: [] } };
        }
        if (url === '/api/demands') {
            return { data: { id: 'D-MOCK-' + Date.now(), ...data, status: 'Open' } };
        }
        if (url.startsWith('/api/trades/') || url.startsWith('/api/execution/')) {
            return { data: { status: 'Advanced' } };
        }
        if (url.startsWith('/api/quotes/')) {
            return { data: { status: 'Decided' } };
        }
        if (url.includes('/strategy')) {
            if (ai) {
                try {
                    const tradeContext = data.trade ? `
Trade Details:
- Commodity: ${data.trade.product}
- Quantity: ${data.trade.qty} MT
- Current Value: $${data.trade.value}
- Buyer: ${data.trade.buyer}
- Supplier: ${data.trade.supplier}
- Risk Score: ${data.trade.risk}/100
` : '';

                    const prompt = `Act as an expert commodities trader and procurement AI copilot.
Generate a structured, highly analytical negotiation strategy for an ongoing commodities trade.
The user's primary objective is: "${data.objective || 'Maximize probability of closing while protecting commercial downside'}".
${tradeContext}
Your output MUST be a valid JSON object with the following keys:
- "targetPrice": (string) Suggested target price per MT.
- "walkAwayPrice": (string) The hard ceiling/floor price to walk away.
- "openingMove": (string) The strategic first move or message to send.
- "leveragePoints": (array of strings) Key advantages or market conditions to use.
- "keyRisks": (array of strings) Commercial or execution risks to mitigate in the contract.
- "concessionStrategy": (string) What to give up, and what to demand in return.`;
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: { responseMimeType: 'application/json' }
                    });
                    return { data: { strategy: JSON.parse(response.text || '{}') } };
                } catch (e) {
                    console.error("Gemini AI failed", e);
                }
            }
            return { data: { strategy: { targetPrice: 'Based on market indices ($480)', walkAwayPrice: '$510 (Internal margin limit)', openingMove: 'Request 5% concession on freight due to port congestion.', leveragePoints: ['Buyer has immediate liquidity', 'Supplier inventory is high'], keyRisks: ['Quality deviation at discharge', 'Vessel demurrage'], concessionStrategy: 'Offer faster payment (sight DLC) in exchange for a 3% price discount.' } } };
        }
        return { data: {} };
    },
    put: async (url: string, data: any) => {
        console.log(`API PUT: ${url}`, data);
        return { data: {} };
    },
    delete: async (url: string) => {
        console.log(`API DELETE: ${url}`);
        return { data: {} };
    }
};
