import { doc, updateDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  User
} from 'firebase/auth';

import { auth, db } from '@/services/firebase';
import IAuthClient from '@/models/auth/IAuthClient';
import IUser from '@/models/auth/IUser'

function toIUser(firebaseUser: User): IUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? null,
    displayName: firebaseUser.displayName ?? null,
    phoneNumber: firebaseUser.phoneNumber ?? null,
  };
}

/** Firebase implementation of IAuthClient. Conforms to IUser from the auth interface. */
export const FirebaseAuthClient: IAuthClient = {
  onAuthStateChanged(nextOrObserver, errorCallback) {
    return auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          const user = await toIUser(firebaseUser);
          nextOrObserver(user);
        } else {
          nextOrObserver(null);
        }
      },
      errorCallback as (error: unknown) => void | undefined
    );
  },

  async signInWithEmailAndPassword(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  },

  async createUserWithEmailAndPassword(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
  },

  sendPasswordResetEmail(email) {
    return sendPasswordResetEmail(auth, email);
  },

  signOut() {
    return auth.signOut();
  },

  async updateUserProfile(user) {
    if (!auth.currentUser) throw new Error('User not found');

    const { displayName, email } = user;

    if (displayName != null) {
      await updateProfile(auth.currentUser, { displayName });
    }

    if (email != null) {
      await updateEmail(auth.currentUser, email);
    }

    // update user profle doc in firebase
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { displayName, email });
  
    return Promise.resolve();
  },
};
