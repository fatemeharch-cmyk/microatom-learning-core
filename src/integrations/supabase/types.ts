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
      atoms: {
        Row: {
          code: string
          created_at: string
          id: string
          order_index: number
          section_id: string
          title_en: string | null
          title_fa: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          order_index?: number
          section_id: string
          title_en?: string | null
          title_fa: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          order_index?: number
          section_id?: string
          title_en?: string | null
          title_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atoms_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          code: string
          created_at: string
          id: string
          order_index: number
          subject_id: string
          title_en: string | null
          title_fa: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          order_index?: number
          subject_id: string
          title_en?: string | null
          title_fa: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          order_index?: number
          subject_id?: string
          title_en?: string | null
          title_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      education_levels: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_en: string | null
          name_fa: string
          order_index: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      grades: {
        Row: {
          code: string
          created_at: string
          education_level_id: string
          id: string
          is_active: boolean
          name_en: string | null
          name_fa: string
          order_index: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          education_level_id: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          education_level_id?: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_education_level_id_fkey"
            columns: ["education_level_id"]
            isOneToOne: false
            referencedRelation: "education_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      majors: {
        Row: {
          code: string
          created_at: string
          grade_id: string
          id: string
          is_active: boolean
          name_en: string | null
          name_fa: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          grade_id: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          grade_id?: string
          id?: string
          is_active?: boolean
          name_en?: string | null
          name_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "majors_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_atoms: {
        Row: {
          chapter_id: string | null
          code: string
          created_at: string
          description: string | null
          difficulty_level: number
          estimated_study_time: number
          grade_id: string | null
          id: string
          learning_order: number
          major_id: string | null
          parent_atom_id: string
          prerequisites: string[]
          section_id: string | null
          subject_id: string | null
          title_en: string | null
          title_fa: string
          updated_at: string
        }
        Insert: {
          chapter_id?: string | null
          code: string
          created_at?: string
          description?: string | null
          difficulty_level?: number
          estimated_study_time?: number
          grade_id?: string | null
          id?: string
          learning_order?: number
          major_id?: string | null
          parent_atom_id: string
          prerequisites?: string[]
          section_id?: string | null
          subject_id?: string | null
          title_en?: string | null
          title_fa: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string | null
          code?: string
          created_at?: string
          description?: string | null
          difficulty_level?: number
          estimated_study_time?: number
          grade_id?: string | null
          id?: string
          learning_order?: number
          major_id?: string | null
          parent_atom_id?: string
          prerequisites?: string[]
          section_id?: string | null
          subject_id?: string | null
          title_en?: string | null
          title_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "micro_atoms_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_atoms_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_atoms_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_atoms_parent_atom_id_fkey"
            columns: ["parent_atom_id"]
            isOneToOne: false
            referencedRelation: "atoms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_atoms_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_atoms_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer: string | null
          code: string
          created_at: string
          difficulty_level: number
          estimated_time: number
          explanation: string | null
          id: string
          micro_atom_id: string
          options: Json | null
          prompt: string
          updated_at: string
        }
        Insert: {
          answer?: string | null
          code: string
          created_at?: string
          difficulty_level?: number
          estimated_time?: number
          explanation?: string | null
          id?: string
          micro_atom_id: string
          options?: Json | null
          prompt: string
          updated_at?: string
        }
        Update: {
          answer?: string | null
          code?: string
          created_at?: string
          difficulty_level?: number
          estimated_time?: number
          explanation?: string | null
          id?: string
          micro_atom_id?: string
          options?: Json | null
          prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_micro_atom_id_fkey"
            columns: ["micro_atom_id"]
            isOneToOne: false
            referencedRelation: "micro_atoms"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          chapter_id: string
          code: string
          created_at: string
          id: string
          order_index: number
          title_en: string | null
          title_fa: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          code: string
          created_at?: string
          id?: string
          order_index?: number
          title_en?: string | null
          title_fa: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          code?: string
          created_at?: string
          id?: string
          order_index?: number
          title_en?: string | null
          title_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          major_id: string
          name_en: string | null
          name_fa: string
          updated_at: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          major_id: string
          name_en?: string | null
          name_fa: string
          updated_at?: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          major_id?: string
          name_en?: string | null
          name_fa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
