import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, UserCog, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserWithPlan {
  user_id: string;
  email: string;
  plan_type: 'free' | 'pro' | 'zip' | 'ace' | 'max';
  is_active: boolean;
  subscription_start: string;
  created_at: string;
}

const PLAN_TYPES = ['free', 'pro', 'zip', 'ace', 'max'];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all users with their plans
      const { data: usersData, error: usersError } = await supabase
        .from('user_plans')
        .select('user_id, plan_type, is_active, subscription_start, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Get email addresses from auth.users
      const userIds = usersData?.map(u => u.user_id) || [];
      
      // We can't directly query auth.users, so we'll need to get emails from profiles or another approach
      // For now, let's use a service role query through an edge function or just show user IDs
      // Alternative: Store emails in profiles table
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        toast.error('Failed to load user emails');
      }

      const usersWithEmails = usersData?.map(user => {
        const authUsersList = authUsers?.users || [];
        const authUser = authUsersList.find((au: any) => au.id === user.user_id);
        return {
          ...user,
          email: authUser?.email || 'Unknown'
        } as UserWithPlan;
      }) || [];

      setUsers(usersWithEmails);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      setUpdating(userId);

      const { error } = await supabase
        .from('user_plans')
        .update({
          plan_type: newPlan as 'free' | 'pro' | 'zip' | 'ace' | 'max',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('User plan updated successfully');
      loadUsers();
    } catch (error: any) {
      console.error('Error updating user plan:', error);
      toast.error('Failed to update user plan');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Note: User email fetching requires admin privileges. If emails show as "Unknown", 
          ensure you have the necessary permissions or use an edge function with service role access.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            User Management
          </h3>
          <p className="text-sm text-muted-foreground">
            {users.length} total users
          </p>
        </div>
        <Button onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Change Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{user.email}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.user_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="uppercase">
                        {user.plan_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.plan_type}
                        onValueChange={(value) => updateUserPlan(user.user_id, value)}
                        disabled={updating === user.user_id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_TYPES.map((plan) => (
                            <SelectItem key={plan} value={plan} className="uppercase">
                              {plan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
