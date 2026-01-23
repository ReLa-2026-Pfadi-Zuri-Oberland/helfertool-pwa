import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCwy-FV4dcszTnmMdARKGrCVUIAfN1phqQ',
  authDomain: 'helfendentool-rela26.firebaseapp.com',
  projectId: 'helfendentool-rela26',
  storageBucket: 'helfendentool-rela26.firebasestorage.app',
  messagingSenderId: '576502766595',
  appId: '1:576502766595:web:7823335135438baa8a4236',
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
