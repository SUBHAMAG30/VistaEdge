import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase/config"

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Actions
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const loginWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider())

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const updateUserProfile = (updates) =>
    updateProfile(auth.currentUser, updates)

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loginWithGoogle,
        resetPassword,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}
