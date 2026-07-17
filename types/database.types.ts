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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_cache: {
        Row: {
          id: string
          payload: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          payload?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          payload?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string
          document_type: string
          document_url: string
          id: string
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          user_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          analysis_json: Json | null
          ats_score: number | null
          company: string | null
          created_at: string
          email_body: string | null
          email_subject: string | null
          hr_email: string | null
          id: string
          job_description: string
          keywords: string[]
          matching_skills: string[]
          missing_skills: string[]
          resume_url: string | null
          role: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_json?: Json | null
          ats_score?: number | null
          company?: string | null
          created_at?: string
          email_body?: string | null
          email_subject?: string | null
          hr_email?: string | null
          id?: string
          job_description: string
          keywords?: string[]
          matching_skills?: string[]
          missing_skills?: string[]
          resume_url?: string | null
          role?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_json?: Json | null
          ats_score?: number | null
          company?: string | null
          created_at?: string
          email_body?: string | null
          email_subject?: string | null
          hr_email?: string | null
          id?: string
          job_description?: string
          keywords?: string[]
          matching_skills?: string[]
          missing_skills?: string[]
          resume_url?: string | null
          role?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ats_reports: {
        Row: {
          created_at: string | null
          id: string
          job_description: string | null
          report: Json
          resume_upload_id: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_description?: string | null
          report?: Json
          resume_upload_id?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_description?: string | null
          report?: Json
          resume_upload_id?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ats_reports_resume_upload_id_fkey"
            columns: ["resume_upload_id"]
            isOneToOne: false
            referencedRelation: "resume_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      gmail_tokens: {
        Row: {
          user_id: string
          gmail_email: string
          access_token: string
          refresh_token: string | null
          expiry_date: string
          updated_at: string
          created_at: string
        }
        Insert: {
          user_id: string
          gmail_email: string
          access_token: string
          refresh_token?: string | null
          expiry_date: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          gmail_email?: string
          access_token?: string
          refresh_token?: string | null
          expiry_date?: string
          updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          application_id: string | null
          body: string
          created_at: string
          error: string | null
          id: string
          provider: string
          recipient: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          body: string
          created_at?: string
          error?: string | null
          id?: string
          provider?: string
          recipient: string
          status: string
          subject: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          body?: string
          created_at?: string
          error?: string | null
          id?: string
          provider?: string
          recipient?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          created_at: string | null
          id: string
          job_description: string | null
          job_title: string | null
          result: Json
          resume_upload_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_description?: string | null
          job_title?: string | null
          result?: Json
          resume_upload_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_description?: string | null
          job_title?: string | null
          result?: Json
          resume_upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_resume_upload_id_fkey"
            columns: ["resume_upload_id"]
            isOneToOne: false
            referencedRelation: "resume_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      job_ingestion_runs: {
        Row: {
          error: string | null
          finished_at: string | null
          id: string
          records_found: number
          records_saved: number
          source_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          error?: string | null
          finished_at?: string | null
          id?: string
          records_found?: number
          records_saved?: number
          source_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          error?: string | null
          finished_at?: string | null
          id?: string
          records_found?: number
          records_saved?: number
          source_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_ingestion_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      job_match_scores: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          matched_skills: string[] | null
          missing_skills: string[] | null
          rationale: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          rationale?: string | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          rationale?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_match_scores_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_sources: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          last_scraped_at: string | null
          name: string
          scrape_interval_minutes: number
          source_type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id: string
          last_scraped_at?: string | null
          name: string
          scrape_interval_minutes?: number
          source_type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          last_scraped_at?: string | null
          name?: string
          scrape_interval_minutes?: number
          source_type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_url: string
          company: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          external_id: string
          id: string
          location: string | null
          posted_at: string | null
          raw_payload: Json
          remote_type: string | null
          salary: string | null
          source: string
          source_id: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          apply_url: string
          company: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          external_id: string
          id?: string
          location?: string | null
          posted_at?: string | null
          raw_payload?: Json
          remote_type?: string | null
          salary?: string | null
          source: string
          source_id?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          apply_url?: string
          company?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          external_id?: string
          id?: string
          location?: string | null
          posted_at?: string | null
          raw_payload?: Json
          remote_type?: string | null
          salary?: string | null
          source?: string
          source_id?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      master_resume: {
        Row: {
          education_json: Json
          experience_json: Json
          id: string
          projects_json: Json
          resume_text: string
          resume_url: string
          skills_json: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          education_json?: Json
          experience_json?: Json
          id?: string
          projects_json?: Json
          resume_text: string
          resume_url: string
          skills_json?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          education_json?: Json
          experience_json?: Json
          id?: string
          projects_json?: Json
          resume_text?: string
          resume_url?: string
          skills_json?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          education: string | null
          email: string | null
          experience: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resume_uploads: {
        Row: {
          created_at: string | null
          extracted_text: string | null
          extraction_status: string
          file_name: string
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          extracted_text?: string | null
          extraction_status?: string
          file_name: string
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          extracted_text?: string | null
          extraction_status?: string
          file_name?: string
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          apply_url: string | null
          company: string
          created_at: string | null
          id: string
          location: string | null
          match_percentage: number | null
          payload: Json
          role: string
          salary: string | null
          source: string
          user_id: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          created_at?: string | null
          id?: string
          location?: string | null
          match_percentage?: number | null
          payload?: Json
          role: string
          salary?: string | null
          source: string
          user_id: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          created_at?: string | null
          id?: string
          location?: string | null
          match_percentage?: number | null
          payload?: Json
          role?: string
          salary?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          ai_preferences: Json
          notification_settings: Json
          privacy_controls: Json
          theme: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_preferences?: Json
          notification_settings?: Json
          privacy_controls?: Json
          theme?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_preferences?: Json
          notification_settings?: Json
          privacy_controls?: Json
          theme?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
