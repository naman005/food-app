import { createContext, useContext, useState, useEffect } from "react";
import { firebaseAuth } from "../firebase/firebaseUtils"; 
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

    const signupUserWithEmailAndPassword = (email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password);
    const loginWithEmailAndPassword = (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password);
    const logout = () => signOut(firebaseAuth);
    const isLoggedIn = user ? true : false;

   return (
    <AuthContext.Provider value={{ user, isLoggedIn, signupUserWithEmailAndPassword, loginWithEmailAndPassword, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}
