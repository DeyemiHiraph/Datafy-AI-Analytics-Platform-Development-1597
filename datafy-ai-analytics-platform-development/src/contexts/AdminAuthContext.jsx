import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Admin roles with permissions
const ADMIN_ROLES = {
  POWER_ADMIN: {
    name: 'Power Admin',
    level: 1,
    permissions: [
      'users.manage',
      'roles.assign',
      'system.health',
      'billing.manage',
      'content.publish',
      'content.edit',
      'content.delete',
      'ai.helpdesk',
      'analytics.view',
      'settings.manage',
      'seo.manage',
      'seo.analyze',
      'seo.optimize',
      'backlinks.manage'
    ]
  },
  EDITOR: {
    name: 'Editor',
    level: 2,
    permissions: [
      'content.publish',
      'content.edit',
      'content.moderate',
      'users.view',
      'seo.analyze',
      'seo.optimize'
    ]
  },
  CONTRIBUTOR: {
    name: 'Contributor',
    level: 3,
    permissions: [
      'content.draft',
      'content.edit.own',
      'seo.analyze'
    ]
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin session
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin privileges by checking user metadata
          const userMetadata = session.user.user_metadata || {};
          const isAdmin = userMetadata.admin_role || 
                          session.user.email === 'poweradmin@datafy.com' || 
                          session.user.email === 'editor@datafy.com';

          if (isAdmin) {
            const adminRole = userMetadata.admin_role || 
                            (session.user.email === 'poweradmin@datafy.com' ? 'POWER_ADMIN' : 'EDITOR');

            const adminSession = {
              id: session.user.id,
              email: session.user.email,
              name: userMetadata.name || session.user.email.split('@')[0],
              role: adminRole,
              lastLogin: new Date().toISOString(),
              ipRestricted: false,
              twoFactorEnabled: false,
              permissions: ADMIN_ROLES[adminRole]?.permissions || []
            };

            setAdminUser(adminSession);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userMetadata = session.user.user_metadata || {};
          const isAdmin = userMetadata.admin_role || 
                          session.user.email === 'poweradmin@datafy.com' || 
                          session.user.email === 'editor@datafy.com';

          if (isAdmin) {
            const adminRole = userMetadata.admin_role || 
                            (session.user.email === 'poweradmin@datafy.com' ? 'POWER_ADMIN' : 'EDITOR');

            const adminSession = {
              id: session.user.id,
              email: session.user.email,
              name: userMetadata.name || session.user.email.split('@')[0],
              role: adminRole,
              lastLogin: new Date().toISOString(),
              ipRestricted: false,
              twoFactorEnabled: false,
              permissions: ADMIN_ROLES[adminRole]?.permissions || []
            };

            setAdminUser(adminSession);
          } else {
            setAdminUser(null);
          }
        } else {
          setAdminUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const adminSignIn = async (email, password, twoFactorCode = null) => {
    try {
      // Check if this is an admin email
      const isAdminEmail = email === 'poweradmin@datafy.com' || email === 'editor@datafy.com';
      
      if (isAdminEmail) {
        // For demo purposes, create the admin user if it doesn't exist
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError && signInError.message.includes('Invalid login credentials')) {
          // Try to create the admin user
          const adminRole = email === 'poweradmin@datafy.com' ? 'POWER_ADMIN' : 'EDITOR';
          const adminName = email === 'poweradmin@datafy.com' ? 'Power Administrator' : 'Content Editor';

          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: adminName,
                admin_role: adminRole,
                is_admin: true
              }
            }
          });

          if (signUpError) {
            return { success: false, error: signUpError.message };
          }

          // If sign up successful, try signing in again
          const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (retryError) {
            return { success: false, error: retryError.message };
          }

          const adminSession = {
            id: retrySignIn.user.id,
            email: retrySignIn.user.email,
            name: adminName,
            role: adminRole,
            lastLogin: new Date().toISOString(),
            ipRestricted: false,
            twoFactorEnabled: false,
            permissions: ADMIN_ROLES[adminRole].permissions
          };

          setAdminUser(adminSession);
          return { success: true, admin: adminSession };
        }

        if (signInError) {
          return { success: false, error: signInError.message };
        }

        const adminRole = email === 'poweradmin@datafy.com' ? 'POWER_ADMIN' : 'EDITOR';
        const adminSession = {
          id: signInData.user.id,
          email: signInData.user.email,
          name: signInData.user.user_metadata?.name || (email === 'poweradmin@datafy.com' ? 'Power Administrator' : 'Content Editor'),
          role: adminRole,
          lastLogin: new Date().toISOString(),
          ipRestricted: false,
          twoFactorEnabled: false,
          permissions: ADMIN_ROLES[adminRole].permissions
        };

        setAdminUser(adminSession);
        return { success: true, admin: adminSession };
      } else {
        return { success: false, error: 'Access denied: Admin credentials required' };
      }
    } catch (error) {
      console.error('Admin sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const adminSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setAdminUser(null);
    } catch (error) {
      console.error('Admin sign out error:', error);
    }
  };

  const hasPermission = (permission) => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission);
  };

  const value = {
    adminUser,
    loading,
    adminSignIn,
    adminSignOut,
    hasPermission,
    ADMIN_ROLES
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};