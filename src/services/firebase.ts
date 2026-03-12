import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { FIREBASE_DEV_CONFIG } from '@/config/keys';

export const app = initializeApp(FIREBASE_DEV_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);