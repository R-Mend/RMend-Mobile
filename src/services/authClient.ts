import type { FirebaseAuthTypes } from 'firebase/compat/auth';

import { firebaseApp } from '@/config/FirebaseApp';

/**
 * Interface for the auth client. Implement this to swap providers (e.g. Firebase, Supabase).
 */
export interface IAuthClient<User = unknown> {
  onAuthStateChanged: (
    nextOrObserver: (user: User | null) => void,
    errorCallback?: (error: Error) => void
  ) => () => void;

  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<{ user: User }>;

  createUserWithEmailAndPassword: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ user: User }>;

  sendPasswordResetEmail: (email: string) => Promise<void>;

  signOut: () => Promise<void>;
}

const auth = firebaseApp.auth();

/** Firebase implementation of IAuthClient. Swap this export to use a different provider. */
export const authClient: IAuthClient<FirebaseAuthTypes.User> = {
  onAuthStateChanged(nextOrObserver, errorCallback) {
    return auth.onAuthStateChanged(
      nextOrObserver,
      errorCallback as (error: unknown) => void | undefined
    );
  },

  signInWithEmailAndPassword(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  },

  createUserWithEmailAndPassword(email, password, displayName) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        credential.user.updateProfile({ displayName });
        return credential;
      });
  },

  sendPasswordResetEmail(email) {
    return auth.sendPasswordResetEmail(email);
  },

  signOut() {
    return auth.signOut();
  },
};
