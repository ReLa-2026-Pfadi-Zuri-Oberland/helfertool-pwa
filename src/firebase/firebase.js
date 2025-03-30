import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBGCtxcCDpEPrT1FzsxobctGaRvGCa-cbA',
  authDomain: 'rela-test.firebaseapp.com',
  projectId: 'rela-test',
  storageBucket: 'rela-test.firebasestorage.app',
  messagingSenderId: '549182367379',
  appId: '1:549182367379:web:2ac11a2d9bb13f42848f66',
};

// Ensure Firebase is initialized only once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const messaging = getMessaging(app);
