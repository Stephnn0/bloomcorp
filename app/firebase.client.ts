import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type Auth,
} from "firebase/auth";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

let _auth: Auth | null = null;

export function getFirebaseAuth(config: FirebaseConfig): Auth {
  if (_auth) return _auth;
  const app = getApps().length ? getApp() : initializeApp(config);
  _auth = getAuth(app);
  return _auth;
}

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
