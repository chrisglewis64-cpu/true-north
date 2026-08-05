/**
 * Supabase database schema types.
 * Regenerate with `supabase gen types typescript` once the CLI is linked.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      standards: {
        Row: {
          id: string;
          user_id: string;
          sort_order: number;
          statement: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sort_order: number;
          statement: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sort_order?: number;
          statement?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          purpose: string;
          why_this_matters: string;
          success_criteria: string;
          current_progress: string;
          next_milestone: string;
          lifecycle: "active" | "upcoming" | "completed";
          mission_status: "on_track" | "at_risk" | "off_course" | "complete";
          status_source: "manual" | "calculated";
          status_updated_at: string | null;
          lessons_learned: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          purpose: string;
          why_this_matters?: string;
          success_criteria?: string;
          current_progress: string;
          next_milestone: string;
          lifecycle: "active" | "upcoming" | "completed";
          mission_status: "on_track" | "at_risk" | "off_course" | "complete";
          status_source?: "manual" | "calculated";
          status_updated_at?: string | null;
          lessons_learned?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          purpose?: string;
          why_this_matters?: string;
          success_criteria?: string;
          current_progress?: string;
          next_milestone?: string;
          lifecycle?: "active" | "upcoming" | "completed";
          mission_status?: "on_track" | "at_risk" | "off_course" | "complete";
          status_source?: "manual" | "calculated";
          status_updated_at?: string | null;
          lessons_learned?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      mission_intents: {
        Row: {
          id: string;
          user_id: string;
          intent_date: string;
          commitment: string;
          source: "suggested" | "custom";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          intent_date: string;
          commitment: string;
          source: "suggested" | "custom";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          intent_date?: string;
          commitment?: string;
          source?: "suggested" | "custom";
          created_at?: string;
        };
        Relationships: [];
      };
      daily_debriefs: {
        Row: {
          id: string;
          user_id: string;
          debrief_date: string;
          standards: Json;
          biggest_win: string;
          biggest_lesson: string;
          tomorrow_one_percent: string;
          tomorrow_priority: string;
          course_correction: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          debrief_date: string;
          standards?: Json;
          biggest_win?: string;
          biggest_lesson?: string;
          tomorrow_one_percent?: string;
          tomorrow_priority?: string;
          course_correction?: string;
          completed_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          debrief_date?: string;
          standards?: Json;
          biggest_win?: string;
          biggest_lesson?: string;
          tomorrow_one_percent?: string;
          tomorrow_priority?: string;
          course_correction?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      daily_one_percent: {
        Row: {
          id: string;
          user_id: string;
          effective_date: string;
          improvement: string;
          source: "debrief" | "seed" | "manual";
          set_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          effective_date: string;
          improvement: string;
          source: "debrief" | "seed" | "manual";
          set_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          effective_date?: string;
          improvement?: string;
          source?: "debrief" | "seed" | "manual";
          set_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
