import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'moderator' | 'user' | null;

interface UseUserRoleReturn {
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
  canAccessAdmin: boolean;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsAdmin(false);
        setIsModerator(false);
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is super admin
        const isSuperAdminUser = user.email === 'mergentaai@gmail.com';
        setIsSuperAdmin(isSuperAdminUser);

        // Fetch user's roles (user can have multiple roles, get highest priority)
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else if (data && data.length > 0) {
          // Priority: admin > moderator > user
          const hasAdminRole = data.some(r => r.role === 'admin');
          const hasModeratorRole = data.some(r => r.role === 'moderator');
          
          if (hasAdminRole) {
            setRole('admin');
            setIsAdmin(true);
          } else if (hasModeratorRole) {
            setRole('moderator');
            setIsModerator(true);
          } else {
            setRole('user');
          }
        } else {
          setRole('user');
        }
      } catch (error) {
        console.error('Error in useUserRole:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    isSuperAdmin,
    canAccessAdmin: isAdmin || isModerator,
  };
};
