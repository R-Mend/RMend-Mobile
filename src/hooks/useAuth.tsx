import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FirebaseAuthTypes } from 'firebase/compat/auth';

import { authClient } from '@/services/authClient';

export type AuthUser = FirebaseAuthTypes.User | null;

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
  signInWithEmailPassword: (
    credentials: EmailPasswordCredentials
  ) => Promise<{ user: FirebaseAuthTypes.User } | null>;
  signUpWithEmailPassword: (
    credentials: EmailPasswordCredentials & { displayName: string }
  ) => Promise<{ user: FirebaseAuthTypes.User } | null>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
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
      (user: AuthUser) => {
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
        const credential = await authClient.signInWithEmailAndPassword(
          email,
          password
        );
        setUser(credential.user);
        return credential;
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
        const credential = await authClient.createUserWithEmailAndPassword(
          email,
          password,
          displayName
        );
        setUser(credential.user);
        return credential;
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

  const value = useMemo<UseAuthReturn>(
    () => ({
      user,
      initializing,
      error,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      sendPasswordResetEmail,
      signOut,
    }),
    [
      user,
      initializing,
      error,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      sendPasswordResetEmail,
      signOut,
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
