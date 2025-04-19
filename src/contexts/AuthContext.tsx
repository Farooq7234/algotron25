
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, fetchUserData } from '../firebase/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  isAdmin: false,
  isEmailVerified: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if email is verified or if user is admin
        const isVerified = user.emailVerified;
        const isAdminUser = user.uid === 'HEuXMylV7jM3c6vKxzRR3b5dIKk2';
        
        setIsEmailVerified(isVerified);
        setIsAdmin(isAdminUser);
        
        // Only fetch user data if email is verified or if user is admin
        if (isVerified || isAdminUser) {
          const data = await fetchUserData(user.uid);
          setUserData(data);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
        setIsEmailVerified(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
