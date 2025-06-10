// frontend/app/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Keep loading state until Firebase Auth has definitively checked user status
  const [loading, setLoading] = useState(true);
  const [firebaseAppInstance, setFirebaseAppInstance] = useState(null);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState(null);
  const [firestoreDbInstance, setFirestoreDbInstance] = useState(null);

  useEffect(() => {
    let app, auth, db;
    try {
      // Initialize Firebase app only if it hasn't been initialized
      // This check is important as initializeApp should only be called once
      if (!firebaseAppInstance && typeof window !== 'undefined') {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        setFirebaseAppInstance(app);
        setFirebaseAuthInstance(auth);
        setFirestoreDbInstance(db); // Set Firestore instance state
      } else {
        // If already initialized (e.g., on subsequent renders after initial client init)
        app = firebaseAppInstance;
        auth = firebaseAuthInstance;
        db = firestoreDbInstance;
      }

      // Only set up auth listener if auth instance is available
      if (auth) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false); // Authentication status has been checked
        });
        return () => unsubscribe(); // Cleanup listener on unmount
      }
    } catch (e) {
      // Handle cases where Firebase might already be initialized (e.g., hot reload)
      // or other initialization errors.
      console.error("Firebase initialization or auth listener error:", e);
      setLoading(false); // Ensure loading state is resolved even on error
      // You might want to display an error message to the user here
    }
  }, [firebaseAppInstance, firebaseAuthInstance]); // Depend on instances to avoid re-initializing

  const loginWithGoogle = async () => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth not initialized yet for login.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuthInstance, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const logout = async () => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth not initialized yet for logout.");
      return;
    }
    try {
      await signOut(firebaseAuthInstance);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    loading, // Expose loading state
    loginWithGoogle,
    logout,
    db: firestoreDbInstance // Expose the Firestore instance
  };

  // Render the children only after the authentication loading is complete.
  // While loading, display a fallback.
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen text-white text-xl">
            Loading authentication...
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
