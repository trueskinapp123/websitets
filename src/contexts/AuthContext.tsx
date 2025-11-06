import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout configuration (default: 1 hour in milliseconds)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
// Activity check interval (check every 5 minutes)
const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  });

  const lastActivityRef = useRef<number>(Date.now());
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const LAST_ACTIVITY_KEY = 'lastActivityTime';

  // Update last activity time (both in memory and localStorage)
  const updateLastActivity = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    } catch (error) {
      console.error('Error saving last activity time:', error);
    }
  };

  // Get last activity time from localStorage
  const getLastActivityFromStorage = (): number | null => {
    try {
      const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (!stored) return null;
      const parsed = parseInt(stored, 10);
      // Validate that it's a valid number and not NaN
      if (isNaN(parsed) || parsed <= 0) {
        console.warn('Invalid stored activity time, clearing it');
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return null;
      }
      return parsed;
    } catch (error) {
      console.error('Error reading last activity time:', error);
      return null;
    }
  };

  // Clear last activity time from localStorage
  const clearLastActivityStorage = () => {
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch (error) {
      console.error('Error clearing last activity time:', error);
    }
  };

  // Check if session is expired
  const checkSessionExpiration = async () => {
    const now = Date.now();
    const lastActivity = lastActivityRef.current;
    const timeSinceActivity = now - lastActivity;

    // Check if user has been inactive for too long
    if (timeSinceActivity > SESSION_TIMEOUT) {
      console.log('Session expired due to inactivity. Logging out...');
      // Clear local state immediately
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false
      });
      // Clear cached data
      localStorage.removeItem('guestCart');
      clearLastActivityStorage();
      // Sign out from Supabase
      await supabase.auth.signOut();
      return;
    }

    // Also check if Supabase session has expired
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const sessionExpiryTime = expiresAt * 1000; // Convert to milliseconds
        if (now > sessionExpiryTime) {
          console.log('Supabase session expired. Logging out...');
          // Clear local state immediately
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false
          });
          // Clear cached data
          localStorage.removeItem('guestCart');
          clearLastActivityStorage();
          // Sign out from Supabase
          await supabase.auth.signOut();
          return;
        }
      }
    }
  };

  // Setup activity tracking
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Check session expiration periodically
    activityCheckIntervalRef.current = setInterval(() => {
      if (state.user) {
        checkSessionExpiration();
      }
    }, ACTIVITY_CHECK_INTERVAL);

    // Also set a timeout for when session should expire
    if (state.user) {
      const remainingTime = SESSION_TIMEOUT - (Date.now() - lastActivityRef.current);
      if (remainingTime > 0) {
        sessionTimeoutRef.current = setTimeout(() => {
          checkSessionExpiration();
        }, remainingTime);
      }
    }

    return () => {
      // Cleanup event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      // Cleanup intervals
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [state.user]);

  useEffect(() => {
    // Immediate synchronous check on page load/reload before async session check
    // This ensures we catch expired sessions even if localStorage is checked before session is retrieved
    const storedLastActivity = getLastActivityFromStorage();
    const now = Date.now();
    
    console.log('🔍 PAGE LOAD/RELOAD - Initial timeout check:', {
      hasStoredActivity: !!storedLastActivity,
      storedTime: storedLastActivity,
      currentTime: now,
      timeSinceActivity: storedLastActivity ? now - storedLastActivity : null,
      timeout: SESSION_TIMEOUT,
      isExpired: storedLastActivity ? (now - storedLastActivity) > SESSION_TIMEOUT : false
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const sessionNow = Date.now();
      console.log('🔍 Session retrieved, checking timeout...');

      // Check if session is expired on initial load
      if (session) {
        // CRITICAL: Check inactivity timeout FIRST (before Supabase session check)
        // This ensures users are logged out if inactive, even if Supabase session is still valid
        const storedLastActivityForSession = getLastActivityFromStorage();
        
        if (storedLastActivityForSession) {
          const timeSinceActivity = sessionNow - storedLastActivityForSession;
          const minutesSinceActivity = Math.round(timeSinceActivity / 1000 / 60);
          const timeoutMinutes = Math.round(SESSION_TIMEOUT / 1000 / 60);
          
          console.log(`⏱️ Inactivity check: ${minutesSinceActivity} minutes since last activity (timeout: ${timeoutMinutes} minutes)`);
          
          if (timeSinceActivity > SESSION_TIMEOUT) {
            console.log('❌ SESSION EXPIRED - Inactivity timeout exceeded on page reload! Logging out...');
            await supabase.auth.signOut();
            clearLastActivityStorage();
            localStorage.removeItem('guestCart');
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false
            });
            return; // Exit early - don't set session state
          }
          
          // Restore last activity time from storage
          lastActivityRef.current = storedLastActivityForSession;
          console.log('✅ Session valid - restored last activity time from storage');
        } else {
          // No stored activity time - check session creation time as fallback
          if (session.user.created_at) {
            const sessionCreatedTime = new Date(session.user.created_at).getTime();
            const timeSinceSessionCreated = sessionNow - sessionCreatedTime;
            const minutesSinceCreated = Math.round(timeSinceSessionCreated / 1000 / 60);
            
            console.log(`⏱️ No stored activity, checking session age: ${minutesSinceCreated} minutes since session created`);
            
            if (timeSinceSessionCreated > SESSION_TIMEOUT) {
              console.log('❌ SESSION EXPIRED - Session created too long ago (no activity stored). Logging out...');
              await supabase.auth.signOut();
              clearLastActivityStorage();
              localStorage.removeItem('guestCart');
              setState({
                user: null,
                profile: null,
                session: null,
                loading: false
              });
              return; // Exit early - don't set session state
            }
          }
          
          // Initialize with current time (fresh login or valid session without stored activity)
          lastActivityRef.current = sessionNow;
          updateLastActivity();
          console.log('✅ Initialized new activity time (fresh login or session without stored activity)');
        }

        // Also check if Supabase session has expired (secondary check)
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const sessionExpiryTime = expiresAt * 1000;
          if (sessionNow > sessionExpiryTime) {
            console.log('❌ SESSION EXPIRED - Supabase session expired. Logging out...');
            await supabase.auth.signOut();
            clearLastActivityStorage();
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false
            });
            return;
          }
        }
      } else {
        // No session, clear any stored activity time
        clearLastActivityStorage();
        console.log('No session found, cleared activity storage');
      }

      setState({
        user: session?.user ?? null,
        profile: null,
        session,
        loading: false
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      const now = Date.now();

      // Handle logout - clear activity storage
      if (!session?.user) {
        clearLastActivityStorage();
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false
        });
        return;
      }

      // CRITICAL: Check inactivity timeout FIRST before setting state
      // This prevents expired sessions from being restored
      if (event !== 'SIGNED_IN' && event !== 'TOKEN_REFRESHED') {
        // For existing sessions (not new logins), check inactivity timeout
        const storedLastActivity = getLastActivityFromStorage();
        
        if (storedLastActivity) {
          const timeSinceActivity = now - storedLastActivity;
          const minutesSinceActivity = Math.round(timeSinceActivity / 1000 / 60);
          
          console.log(`⏱️ Auth state change - Inactivity check: ${minutesSinceActivity} minutes since last activity`);
          
          if (timeSinceActivity > SESSION_TIMEOUT) {
            console.log('❌ SESSION EXPIRED in auth state change - Inactivity timeout exceeded! Logging out...');
            await supabase.auth.signOut();
            clearLastActivityStorage();
            localStorage.removeItem('guestCart');
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false
            });
            return; // Exit early - don't set session state
          }
          
          // Restore last activity time
          lastActivityRef.current = storedLastActivity;
        } else if (session.user.created_at) {
          // Fallback: check session age if no stored activity
          const sessionCreatedTime = new Date(session.user.created_at).getTime();
          const timeSinceSessionCreated = now - sessionCreatedTime;
          
          if (timeSinceSessionCreated > SESSION_TIMEOUT) {
            console.log('❌ SESSION EXPIRED in auth state change - Session created too long ago! Logging out...');
            await supabase.auth.signOut();
            clearLastActivityStorage();
            localStorage.removeItem('guestCart');
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false
            });
            return; // Exit early - don't set session state
          }
        }
      }

      // Reset activity timer on new login or token refresh
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        updateLastActivity();
        console.log('✅ New login/token refresh - activity time updated');
      }

      // Check if Supabase session has expired
      if (session) {
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const sessionExpiryTime = expiresAt * 1000;
          if (now > sessionExpiryTime) {
            console.log('❌ SESSION EXPIRED in auth state change - Supabase session expired. Logging out...');
            await supabase.auth.signOut();
            clearLastActivityStorage();
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false
            });
            return;
          }
        }
      }
      
      // Only set state if all checks pass
      setState({
        user: session?.user ?? null,
        profile: null,
        session,
        loading: false
      });

      if (session?.user) {
        console.log('Fetching profile for user:', session.user.id);
        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Profile fetch result:', { profile, error });

        setState(prev => ({
          ...prev,
          profile: profile || null
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // Update activity time on successful login
      if (!error) {
        updateLastActivity();
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
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
    // Clear local state immediately for fast UI response
    setState({
      user: null,
      profile: null,
      session: null,
      loading: false
    });
    
    // Clear cached data immediately
    localStorage.removeItem('guestCart');
    clearLastActivityStorage();
    
    // Sign out from Supabase in background (don't wait for it)
    supabase.auth.signOut().catch(error => {
      console.error('Background sign out error:', error);
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      console.error('updateProfile: No user logged in');
      return { error: new Error('No user logged in') };
    }

    try {
      console.log('updateProfile: Updating profile for user:', state.user.id);
      console.log('updateProfile: Updates:', updates);

      // First, check if profile exists
      const { error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', state.user.id)
        .single();

      // If profile doesn't exist, create it first
      if (checkError && checkError.code === 'PGRST116') {
        console.log('updateProfile: Profile does not exist, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: state.user.id,
            email: state.user.email || '',
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('updateProfile: Error creating profile:', createError);
          return { error: createError };
        }

        // Update state with new profile (keep snake_case as that's what AuthContext uses)
        setState(prev => ({
          ...prev,
          profile: newProfile as UserProfile
        }));

        console.log('updateProfile: Profile created successfully');
        return { error: null };
      }

      // Profile exists, update it
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id)
        .select()
        .single();

      if (updateError) {
        console.error('updateProfile: Error updating profile:', updateError);
        console.error('updateProfile: Error details:', JSON.stringify(updateError, null, 2));
        return { error: updateError };
      }

      // Update state with refreshed profile from database (keep snake_case as that's what AuthContext uses)
      if (updatedProfile) {
        setState(prev => ({
          ...prev,
          profile: updatedProfile as UserProfile
        }));
        console.log('updateProfile: Profile updated successfully');
      }

      return { error: null };
    } catch (error) {
      console.error('updateProfile: Unexpected error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to update profile') };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
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