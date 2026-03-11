import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { FirebaseAuthClient } from '@/services/auth/FirebaseAuthClient';
import IUser from '@/models/auth/IUser';

const authClient = FirebaseAuthClient;

export type AuthUser = IUser | null;

export type AuthState = {
  user: AuthUser;
  initializing: boolean;
  error: Error | null;
};

export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export type UseAuthReturn = AuthState & {
  signInWithEmailPassword: (credentials: EmailPasswordCredentials) => Promise<void>;
  signUpWithEmailPassword: (credentials: EmailPasswordCredentials & { displayName: string }) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: { displayName?: string; email?: string; }) => Promise<void>;
};

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = authClient.onAuthStateChanged(
      (user) => {
        setUser(user);
        setInitializing(false);
      },
      err => {
        setError(err);
        setInitializing(false);
      }
    );

    return unsubscribe;
  }, []);

  const signInWithEmailPassword = useCallback(
    async ({ email, password }: EmailPasswordCredentials) => {
      setError(null);
      try {
        await authClient.signInWithEmailAndPassword(email, password);
        // User state is updated via onAuthStateChanged
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  const signUpWithEmailPassword = useCallback(
    async ({ email, password, displayName }: EmailPasswordCredentials & { displayName: string }) => {
      setError(null);
      try {
        await authClient.createUserWithEmailAndPassword(email, password, displayName);
        // User state is updated via onAuthStateChanged
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setError(null);
    try {
      await authClient.sendPasswordResetEmail(email);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await authClient.signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const updateProfile = async ({ email, displayName }: { displayName?: string; email?: string; }) => {
      if (!user) return;
      setError(null);
      try {
        const nextUser: IUser = {
          uid: user.uid,
          displayName: displayName ?? user.displayName,
          email: email ?? user.email,
          phoneNumber: user.phoneNumber,
        };

        await authClient.updateUserProfile(nextUser);

        // Update was successfil
        console.log('User Profile Updated', nextUser)
        setUser(nextUser);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    };

  const value = useMemo<UseAuthReturn>(
    () => ({
      user,
      initializing,
      error,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      sendPasswordResetEmail,
      signOut,
      updateProfile,
    }),
    [
      user,
      initializing,
      error,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      sendPasswordResetEmail,
      signOut,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
