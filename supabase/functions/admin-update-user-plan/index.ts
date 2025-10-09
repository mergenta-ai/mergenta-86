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
      console.error('Auth error:', authError)
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
      console.error('Roles check error:', rolesError)
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin or Moderator access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { userId, planType } = await req.json()

    if (!userId || !planType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and planType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate plan type
    const validPlanTypes = ['free', 'pro', 'zip', 'ace', 'max']
    if (!validPlanTypes.includes(planType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Admin ${user.email} updating user ${userId} to plan ${planType}`)

    // Update user plan using service role (bypasses RLS)
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('user_plans')
      .update({
        plan_type: planType,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (updateError) {
      console.error('Update error:', updateError)
      throw updateError
    }

    // If no rows were updated, the user_plans entry might not exist - create it
    if (!updateData || updateData.length === 0) {
      console.log(`No user_plans entry found for ${userId}, creating one`)
      
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('user_plans')
        .insert({
          user_id: userId,
          plan_type: planType,
          is_active: true,
          subscription_start: new Date().toISOString()
        })
        .select()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      console.log(`Successfully created user_plans entry for ${userId}`)
      return new Response(
        JSON.stringify({ success: true, data: insertData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully updated user_plans for ${userId}`)
    return new Response(
      JSON.stringify({ success: true, data: updateData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-update-user-plan:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
