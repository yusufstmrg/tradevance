import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  role: string;
  name: string;
  company: string;
  organizationId?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        let role = 'Buyer';
        let company = 'Unknown Company';
        let organizationId = '';
        
        // Automatic Operator routing based on email domain
        if (user.email?.endsWith('@tradevance.com')) {
           role = 'Operator';
        } else if (docSnap.exists()) {
           role = docSnap.data().role || 'Buyer';
           company = docSnap.data().company || 'Unknown Company';
           organizationId = docSnap.data().organizationId || '';
        }

        setUserData({ 
           role, 
           name: user.displayName || user.email?.split('@')[0] || 'User', 
           company,
           organizationId
        });
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
