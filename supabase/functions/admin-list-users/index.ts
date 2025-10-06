import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the request is from an authenticated admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin or moderator
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'moderator'])
      .single()

    if (rolesError || !userRoles) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get ALL auth users first
    const { data: authData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw usersError
    }

    // Get all user plans
    const { data: userPlans, error: plansError } = await supabaseAdmin
      .from('user_plans')
      .select('user_id, plan_type, is_active, subscription_start, created_at')

    if (plansError) {
      throw plansError
    }

    // Combine the data - include ALL auth users, even those without plan entries
    const usersWithEmails = authData.users.map(authUser => {
      const plan = (userPlans || []).find(p => p.user_id === authUser.id)
      
      return {
        user_id: authUser.id,
        email: authUser.email || 'Unknown',
        plan_type: plan?.plan_type || 'free', // Default to 'free' if no plan entry
        is_active: plan?.is_active ?? true,
        subscription_start: plan?.subscription_start || authUser.created_at,
        created_at: authUser.created_at,
        email_confirmed: authUser.email_confirmed_at ? true : false
      }
    })
    
    // Sort by created_at descending
    usersWithEmails.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return new Response(
      JSON.stringify({ users: usersWithEmails }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-list-users:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
