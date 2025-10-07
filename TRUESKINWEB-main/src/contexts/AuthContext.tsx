import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          // Handle sign out event specifically
          console.log('User signed out, clearing all state');
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false
          });
          return;
        }
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false
        }));

        // Load user profile when user signs in
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          // Clear profile when user signs out
          setState(prev => ({
            ...prev,
            profile: null
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setState(prev => ({
        ...prev,
        profile: data
      }));
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('=== SIGN OUT STARTED ===');
      console.log('Current user before sign out:', state.user?.email);
      console.log('Current session before sign out:', state.session?.access_token ? 'Active' : 'None');
      
      // Clear local state first to provide immediate feedback
      console.log('Clearing local state...');
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false
      });
      console.log('Local state cleared');
      
      // Clear any cached data
      console.log('Clearing cached data...');
      localStorage.removeItem('guestCart');
      console.log('Cached data cleared');
      
      // Sign out from Supabase
      console.log('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        console.warn('Supabase sign out failed, but local state cleared');
      } else {
        console.log('Supabase sign out successful');
      }
      
      console.log('=== SIGN OUT COMPLETED ===');
    } catch (error) {
      console.error('Error signing out:', error);
      console.warn('Sign out error, but local state cleared');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) {
        return { error: { message: 'No user logged in' } };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      setState(prev => ({
        ...prev,
        profile: data
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
