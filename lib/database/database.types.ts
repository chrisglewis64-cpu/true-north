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
          email: string | null;
          display_name: string;
          created_at: string;
          onboarding_completed_at: string | null;
          notification_preferences: Json;
          timezone: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name: string;
          created_at?: string;
          onboarding_completed_at?: string | null;
          notification_preferences?: Json;
          timezone?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string;
          created_at?: string;
          onboarding_completed_at?: string | null;
          notification_preferences?: Json;
          timezone?: string | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_logs: {
        Row: {
          id: string;
          user_id: string;
          reminder_id: string;
          period_key: string;
          status: "sent" | "skipped_completed" | "failed";
          endpoint: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reminder_id: string;
          period_key: string;
          status: "sent" | "skipped_completed" | "failed";
          endpoint?: string | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reminder_id?: string;
          period_key?: string;
          status?: "sent" | "skipped_completed" | "failed";
          endpoint?: string | null;
          error?: string | null;
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
          category: string;
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
          category?: string;
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
          category?: string;
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
      evidence: {
        Row: {
          id: string;
          user_id: string;
          evidence_date: string;
          debrief_date: string;
          standard_statement: string;
          evidence_text: string;
          mission_reference: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          evidence_date: string;
          debrief_date: string;
          standard_statement: string;
          evidence_text: string;
          mission_reference?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          evidence_date?: string;
          debrief_date?: string;
          standard_statement?: string;
          evidence_text?: string;
          mission_reference?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      weekly_bearings: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          bearing_ids: string[];
          source: "recommended" | "manual";
          selected_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          bearing_ids: string[];
          source?: "recommended" | "manual";
          selected_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          bearing_ids?: string[];
          source?: "recommended" | "manual";
          selected_at?: string;
          created_at?: string;
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
