import IUser from './IUser'

/**
 * Interface for the auth client. Implement this to swap providers (e.g. Firebase, Supabase).
 * All methods use IUser; implementations adapt their provider's user type to IUser.
 */
export default interface IAuthClient {
  /** Subscribes to auth login and logout state changes. */
  onAuthStateChanged: (
    nextOrObserver: (user: IUser | null) => void,
    errorCallback?: (error: Error) => void
  ) => () => void;

  /** Signs in a user with email and password. */
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<void>;

  /** Creates a new user with email and password and signs them in. */
  createUserWithEmailAndPassword: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;

  /** Sends a password reset email to the user. */
  sendPasswordResetEmail: (email: string) => Promise<void>;

  /** Signs out the user. */
  signOut: () => Promise<void>;

  /** Updates the user profile. */
  updateUserProfile: (user: IUser) => Promise<void>;
}