export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cover_letters: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      job_agent_activities: {
        Row: {
          action: string
          created_at: string
          id: string
          job_id: string | null
          result: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          job_id?: string | null
          result?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          job_id?: string | null
          result?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_agent_activities_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_agent_configs: {
        Row: {
          auto_apply_preferences: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          ml_parameters: Json | null
          resume_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_apply_preferences?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          ml_parameters?: Json | null
          resume_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_apply_preferences?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          ml_parameters?: Json | null
          resume_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_agent_configs_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          auto_applied: boolean | null
          company: string
          cover_letter_id: string | null
          created_at: string
          id: string
          job_id: string | null
          job_title: string
          job_url: string | null
          notes: string | null
          resume_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_applied?: boolean | null
          company: string
          cover_letter_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_title: string
          job_url?: string | null
          notes?: string | null
          resume_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_applied?: boolean | null
          company?: string
          cover_letter_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_title?: string
          job_url?: string | null
          notes?: string | null
          resume_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_filter_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_filter_options: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_filter_options_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_filter_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      job_preferences: {
        Row: {
          created_at: string
          employment_types: string[] | null
          id: string
          industries: string[] | null
          job_title: string | null
          location_preferences: string[] | null
          max_salary: number | null
          min_salary: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employment_types?: string[] | null
          id?: string
          industries?: string[] | null
          job_title?: string | null
          location_preferences?: string[] | null
          max_salary?: number | null
          min_salary?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          employment_types?: string[] | null
          id?: string
          industries?: string[] | null
          job_title?: string | null
          location_preferences?: string[] | null
          max_salary?: number | null
          min_salary?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string
          id: string
          is_new: boolean | null
          location: string
          logo: string | null
          posted: string
          requirements: string[]
          salary: string | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          id?: string
          is_new?: boolean | null
          location: string
          logo?: string | null
          posted?: string
          requirements: string[]
          salary?: string | null
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          id?: string
          is_new?: boolean | null
          location?: string
          logo?: string | null
          posted?: string
          requirements?: string[]
          salary?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      linkedin_credentials: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ml_model_configs: {
        Row: {
          created_at: string
          endpoint_url: string | null
          id: string
          model_type: string
          parameters: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint_url?: string | null
          id?: string
          model_type: string
          parameters?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint_url?: string | null
          id?: string
          model_type?: string
          parameters?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: string
          created_at: string
          id: string
          skills: Json | null
          title: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          skills?: Json | null
          title: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          skills?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      "user signup details": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      toggle_job_agent: {
        Args: { is_active?: boolean }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
