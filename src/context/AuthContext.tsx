'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

function generateStrangRCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `StrangR#${num}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken()
          setToken(idToken)
          
          // Fetch or create user profile in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userRef)
          
          let userData: User
          
          if (!userSnap.exists()) {
            // New user — create profile
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              strangRCode: generateStrangRCode(),
              displayName: firebaseUser.displayName || undefined,
              profileImage: firebaseUser.photoURL || undefined,
              accountCreatedDate: new Date(),
              searchingForMatch: false,
              currentMatchId: null,
              lastActiveTime: new Date(),
              isOnline: true,
              friendsList: [],
              blockedList: [],
              banStatus: false,
              reportCount: 0,
              reportedByList: [],
              premiumStatus: false,
            }
            await setDoc(userRef, { ...userData, accountCreatedDate: serverTimestamp(), lastActiveTime: serverTimestamp() })
          } else {
            const data = userSnap.data()
            userData = {
              uid: firebaseUser.uid,
              email: data.email,
              strangRCode: data.strangRCode,
              displayName: data.displayName,
              profileImage: data.profileImage,
              accountCreatedDate: data.accountCreatedDate?.toDate() || new Date(),
              searchingForMatch: data.searchingForMatch || false,
              currentMatchId: data.currentMatchId || null,
              lastActiveTime: data.lastActiveTime?.toDate() || new Date(),
              isOnline: true,
              friendsList: data.friendsList || [],
              blockedList: data.blockedList || [],
              banStatus: data.banStatus || false,
              banReason: data.banReason,
              banExpiryTime: data.banExpiryTime?.toDate(),
              reportCount: data.reportCount || 0,
              reportedByList: data.reportedByList || [],
              premiumStatus: data.premiumStatus || false,
              premiumExpiryDate: data.premiumExpiryDate?.toDate(),
              premiumDenialList: data.premiumDenialList || [],
            }
          }
          
          setState({ user: userData, isLoading: false, isAuthenticated: true })
        } catch (err: any) {
          console.error('Auth error:', err)
          if (err.message?.includes('permission-denied')) {
            alert('Firebase Profile Error: Please check your Firestore Security Rules.')
          }
          setState({ user: null, isLoading: false, isAuthenticated: false })
        }
      } else {
        setToken(null)
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    })
    
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error('Google sign in error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setToken(null)
      setState({ user: null, isLoading: false, isAuthenticated: false })
    } catch (err) {
      console.error('Logout error:', err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, token, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
