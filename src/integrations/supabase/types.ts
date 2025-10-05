export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      cloudconvert_usage: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          daily_count: number | null
          export_date: string
          export_type: string | null
          id: string
          last_reset: string | null
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          daily_count?: number | null
          export_date?: string
          export_type?: string | null
          id?: string
          last_reset?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          daily_count?: number | null
          export_date?: string
          export_type?: string | null
          id?: string
          last_reset?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          workflow_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
          workflow_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          workflow_type?: string | null
        }
        Relationships: []
      }
      document_upload_usage: {
        Row: {
          created_at: string | null
          daily_count: number | null
          file_name: string | null
          file_size: number | null
          id: string
          last_reset: string | null
          pages_extracted: number | null
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_count?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          last_reset?: string | null
          pages_extracted?: number | null
          upload_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_count?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          last_reset?: string | null
          pages_extracted?: number | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      email_limits: {
        Row: {
          created_at: string | null
          daily_gmail_quota: number | null
          daily_outlook_quota: number | null
          id: string
          monthly_gmail_quota: number | null
          monthly_outlook_quota: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
        }
        Insert: {
          created_at?: string | null
          daily_gmail_quota?: number | null
          daily_outlook_quota?: number | null
          id?: string
          monthly_gmail_quota?: number | null
          monthly_outlook_quota?: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
        }
        Update: {
          created_at?: string | null
          daily_gmail_quota?: number | null
          daily_outlook_quota?: number | null
          id?: string
          monthly_gmail_quota?: number | null
          monthly_outlook_quota?: number | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
        }
        Relationships: []
      }
      email_usage: {
        Row: {
          created_at: string | null
          daily_count: number | null
          id: string
          last_daily_reset: string | null
          last_monthly_reset: string | null
          monthly_count: number | null
          service_type: string
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_count?: number | null
          id?: string
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          monthly_count?: number | null
          service_type: string
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_count?: number | null
          id?: string
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          monthly_count?: number | null
          service_type?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      export_limits: {
        Row: {
          created_at: string | null
          daily_cloudconvert_quota: number | null
          daily_document_upload: number | null
          daily_google_docs_export: number | null
          daily_google_sheets_export: number | null
          daily_txt_download: number | null
          id: string
          max_document_pages: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
        }
        Insert: {
          created_at?: string | null
          daily_cloudconvert_quota?: number | null
          daily_document_upload?: number | null
          daily_google_docs_export?: number | null
          daily_google_sheets_export?: number | null
          daily_txt_download?: number | null
          id?: string
          max_document_pages?: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
        }
        Update: {
          created_at?: string | null
          daily_cloudconvert_quota?: number | null
          daily_document_upload?: number | null
          daily_google_docs_export?: number | null
          daily_google_sheets_export?: number | null
          daily_txt_download?: number | null
          id?: string
          max_document_pages?: number | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
        }
        Relationships: []
      }
      feature_limits: {
        Row: {
          allow_model_overwrite: boolean | null
          allow_web_search: boolean | null
          content_type: string | null
          created_at: string | null
          daily_quota: number
          fallback_models: string[] | null
          feature_name: string
          id: string
          intent_type: string | null
          max_words: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          primary_model: string
          updated_at: string | null
        }
        Insert: {
          allow_model_overwrite?: boolean | null
          allow_web_search?: boolean | null
          content_type?: string | null
          created_at?: string | null
          daily_quota?: number
          fallback_models?: string[] | null
          feature_name: string
          id?: string
          intent_type?: string | null
          max_words?: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          primary_model: string
          updated_at?: string | null
        }
        Update: {
          allow_model_overwrite?: boolean | null
          allow_web_search?: boolean | null
          content_type?: string | null
          created_at?: string | null
          daily_quota?: number
          fallback_models?: string[] | null
          feature_name?: string
          id?: string
          intent_type?: string | null
          max_words?: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          primary_model?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gmail_connections: {
        Row: {
          auto_reply_enabled: boolean | null
          connected_at: string | null
          created_at: string | null
          default_reply_mode: string | null
          encrypted_access_token: string
          encrypted_refresh_token: string
          gmail_email: string
          history_id: string | null
          id: string
          last_synced_at: string | null
          token_expires_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          connected_at?: string | null
          created_at?: string | null
          default_reply_mode?: string | null
          encrypted_access_token: string
          encrypted_refresh_token: string
          gmail_email: string
          history_id?: string | null
          id?: string
          last_synced_at?: string | null
          token_expires_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_reply_enabled?: boolean | null
          connected_at?: string | null
          created_at?: string | null
          default_reply_mode?: string | null
          encrypted_access_token?: string
          encrypted_refresh_token?: string
          gmail_email?: string
          history_id?: string | null
          id?: string
          last_synced_at?: string | null
          token_expires_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gmail_quota_usage: {
        Row: {
          created_at: string | null
          daily_count: number | null
          id: string
          last_daily_reset: string | null
          last_monthly_reset: string | null
          monthly_count: number | null
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_count?: number | null
          id?: string
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          monthly_count?: number | null
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_count?: number | null
          id?: string
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          monthly_count?: number | null
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_user: boolean
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_user: boolean
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_user?: boolean
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          limit_value: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          quota_type: Database["public"]["Enums"]["quota_type"]
          reset_period: string | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          limit_value: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          quota_type: Database["public"]["Enums"]["quota_type"]
          reset_period?: string | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          limit_value?: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          quota_type?: Database["public"]["Enums"]["quota_type"]
          reset_period?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          middle_name: string | null
          professional_title: string | null
          profile_image_url: string | null
          profile_visibility: string | null
          social_links: Json | null
          tagline: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          middle_name?: string | null
          professional_title?: string | null
          profile_image_url?: string | null
          profile_visibility?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          middle_name?: string | null
          professional_title?: string | null
          profile_image_url?: string | null
          profile_visibility?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      prompt_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          category: string
          content_type: string
          created_at: string
          id: string
          is_active: boolean
          template_function: string
          updated_at: string
          version: number
        }
        Insert: {
          category: string
          content_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          template_function: string
          updated_at?: string
          version?: number
        }
        Update: {
          category?: string
          content_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          template_function?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      router_config: {
        Row: {
          async_token_limit: number
          created_at: string | null
          daily_gen_quota: number
          daily_web_search_quota: number
          id: string
          monthly_document_upload_quota: number
          monthly_gen_quota: number
          monthly_image_quota: number
          monthly_video_quota: number
          monthly_web_search_quota: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          sync_token_limit: number
        }
        Insert: {
          async_token_limit: number
          created_at?: string | null
          daily_gen_quota: number
          daily_web_search_quota: number
          id?: string
          monthly_document_upload_quota: number
          monthly_gen_quota: number
          monthly_image_quota: number
          monthly_video_quota: number
          monthly_web_search_quota: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          sync_token_limit: number
        }
        Update: {
          async_token_limit?: number
          created_at?: string | null
          daily_gen_quota?: number
          daily_web_search_quota?: number
          id?: string
          monthly_document_upload_quota?: number
          monthly_gen_quota?: number
          monthly_image_quota?: number
          monthly_video_quota?: number
          monthly_web_search_quota?: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          sync_token_limit?: number
        }
        Relationships: []
      }
      rss_feeds: {
        Row: {
          category: string | null
          content: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          published_at: string | null
          scraped_at: string | null
          source_name: string
          source_url: string
          summary: string | null
          title: string
          url: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          published_at?: string | null
          scraped_at?: string | null
          source_name: string
          source_url: string
          summary?: string | null
          title: string
          url: string
        }
        Update: {
          category?: string | null
          content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          published_at?: string | null
          scraped_at?: string | null
          source_name?: string
          source_url?: string
          summary?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      search_cache: {
        Row: {
          cache_key: string
          created_at: string
          id: string
          results: Json
        }
        Insert: {
          cache_key: string
          created_at?: string
          id?: string
          results: Json
        }
        Update: {
          cache_key?: string
          created_at?: string
          id?: string
          results?: Json
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          cache_hits: number | null
          created_at: string | null
          fallback_used: boolean | null
          id: string
          intent_type: string | null
          query_text: string
          rss_sources_count: number | null
          search_results_count: number | null
          sources_used: Json | null
          tokens_consumed: number | null
          updated_at: string | null
          user_id: string
          web_sources_count: number | null
        }
        Insert: {
          cache_hits?: number | null
          created_at?: string | null
          fallback_used?: boolean | null
          id?: string
          intent_type?: string | null
          query_text: string
          rss_sources_count?: number | null
          search_results_count?: number | null
          sources_used?: Json | null
          tokens_consumed?: number | null
          updated_at?: string | null
          user_id: string
          web_sources_count?: number | null
        }
        Update: {
          cache_hits?: number | null
          created_at?: string | null
          fallback_used?: boolean | null
          id?: string
          intent_type?: string | null
          query_text?: string
          rss_sources_count?: number | null
          search_results_count?: number | null
          sources_used?: Json | null
          tokens_consumed?: number | null
          updated_at?: string | null
          user_id?: string
          web_sources_count?: number | null
        }
        Relationships: []
      }
      talk_mode_usage: {
        Row: {
          created_at: string
          daily_minutes_limit: number | null
          id: string
          last_reset: string
          updated_at: string
          used_minutes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_minutes_limit?: number | null
          id?: string
          last_reset?: string
          updated_at?: string
          used_minutes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          daily_minutes_limit?: number | null
          id?: string
          last_reset?: string
          updated_at?: string
          used_minutes?: number
          user_id?: string
        }
        Relationships: []
      }
      usage_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_id: string | null
          user_id: string
          workflow_type: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
          user_id: string
          workflow_type?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
          user_id?: string
          workflow_type?: string | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          subscription_end: string | null
          subscription_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_personality: string | null
          analytics_enabled: boolean | null
          auto_save_conversations: boolean | null
          auto_save_enabled: boolean | null
          created_at: string
          data_sharing_enabled: boolean | null
          email_notifications: boolean | null
          font_size: string | null
          high_contrast: boolean | null
          id: string
          language: string | null
          marketing_notifications: boolean | null
          memory_enabled: boolean | null
          message_persistence: boolean | null
          notifications_enabled: boolean | null
          preferred_ai_model: string | null
          push_notifications: boolean | null
          theme: string | null
          theme_variant: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_personality?: string | null
          analytics_enabled?: boolean | null
          auto_save_conversations?: boolean | null
          auto_save_enabled?: boolean | null
          created_at?: string
          data_sharing_enabled?: boolean | null
          email_notifications?: boolean | null
          font_size?: string | null
          high_contrast?: boolean | null
          id?: string
          language?: string | null
          marketing_notifications?: boolean | null
          memory_enabled?: boolean | null
          message_persistence?: boolean | null
          notifications_enabled?: boolean | null
          preferred_ai_model?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          theme_variant?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_personality?: string | null
          analytics_enabled?: boolean | null
          auto_save_conversations?: boolean | null
          auto_save_enabled?: boolean | null
          created_at?: string
          data_sharing_enabled?: boolean | null
          email_notifications?: boolean | null
          font_size?: string | null
          high_contrast?: boolean | null
          id?: string
          language?: string | null
          marketing_notifications?: boolean | null
          memory_enabled?: boolean | null
          message_persistence?: boolean | null
          notifications_enabled?: boolean | null
          preferred_ai_model?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          theme_variant?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quotas: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          last_reset: string | null
          quota_type: Database["public"]["Enums"]["quota_type"]
          updated_at: string | null
          used_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          last_reset?: string | null
          quota_type: Database["public"]["Enums"]["quota_type"]
          updated_at?: string | null
          used_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          last_reset?: string | null
          quota_type?: Database["public"]["Enums"]["quota_type"]
          updated_at?: string | null
          used_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_fallbacks: {
        Row: {
          created_at: string | null
          error_message: string | null
          fallback_vendor: Database["public"]["Enums"]["vendor_type"] | null
          id: string
          primary_vendor: Database["public"]["Enums"]["vendor_type"]
          request_data: Json | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          fallback_vendor?: Database["public"]["Enums"]["vendor_type"] | null
          id?: string
          primary_vendor: Database["public"]["Enums"]["vendor_type"]
          request_data?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          fallback_vendor?: Database["public"]["Enums"]["vendor_type"] | null
          id?: string
          primary_vendor?: Database["public"]["Enums"]["vendor_type"]
          request_data?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      vendor_quotas: {
        Row: {
          created_at: string | null
          id: string
          last_reset: string | null
          limit_value: number
          quota_type: Database["public"]["Enums"]["quota_type"]
          updated_at: string | null
          used_count: number | null
          vendor_type: Database["public"]["Enums"]["vendor_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reset?: string | null
          limit_value: number
          quota_type: Database["public"]["Enums"]["quota_type"]
          updated_at?: string | null
          used_count?: number | null
          vendor_type: Database["public"]["Enums"]["vendor_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reset?: string | null
          limit_value?: number
          quota_type?: Database["public"]["Enums"]["quota_type"]
          updated_at?: string | null
          used_count?: number | null
          vendor_type?: Database["public"]["Enums"]["vendor_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      plan_type: "free" | "pro" | "zip" | "ace" | "max"
      quota_type: "daily" | "monthly" | "per_card" | "per_vendor"
      vendor_type:
        | "openai"
        | "anthropic"
        | "google"
        | "gemini"
        | "mistral"
        | "xai"
        | "elevenlabs"
        | "cloudconvert"
        | "local"
        | "meta"
        | "microsoft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan_type: ["free", "pro", "zip", "ace", "max"],
      quota_type: ["daily", "monthly", "per_card", "per_vendor"],
      vendor_type: [
        "openai",
        "anthropic",
        "google",
        "gemini",
        "mistral",
        "xai",
        "elevenlabs",
        "cloudconvert",
        "local",
        "meta",
        "microsoft",
      ],
    },
  },
} as const
