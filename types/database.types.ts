export type OrderStatus = "pending" | "paid" | "active" | "expired";
export type MediaType = "photo" | "video" | "voice" | "song";

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          invite_id: string;
          couple_name_1: string;
          couple_name_2: string;
          wedding_date: string;
          template_slug: string;
          status: OrderStatus;
          payment_id: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          amount_paid: number | null;
          phone_number: string | null;
          email: string | null;
          custom_message: string | null;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          invite_id: string;
          couple_name_1: string;
          couple_name_2: string;
          wedding_date: string;
          template_slug: string;
          status?: OrderStatus;
          payment_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          amount_paid?: number | null;
          phone_number?: string | null;
          email?: string | null;
          custom_message?: string | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          order_id: string | null;
          event_name: string;
          event_date: string;
          event_time: string | null;
          venue_name: string;
          venue_address: string;
          venue_city: string | null;
          venue_map_link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          event_name: string;
          event_date: string;
          event_time?: string | null;
          venue_name: string;
          venue_address: string;
          venue_city?: string | null;
          venue_map_link?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          order_id: string | null;
          media_type: MediaType;
          file_url: string;
          file_name: string | null;
          file_size: number | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          media_type: MediaType;
          file_url: string;
          file_name?: string | null;
          file_size?: number | null;
          uploaded_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [];
      };
      rsvps: {
        Row: {
          id: string;
          invite_id: string;
          guest_name: string;
          attending: boolean;
          guest_count: number;
          message: string | null;
          phone_number: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invite_id: string;
          guest_name: string;
          attending: boolean;
          guest_count?: number;
          message?: string | null;
          phone_number?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rsvps"]["Insert"]>;
        Relationships: [];
      };
      question_bank: {
        Row: {
          id: string;
          category: "nostalgia" | "playful" | "soul" | "discovery" | "future";
          question_text: string;
          options: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          category: "nostalgia" | "playful" | "soul" | "discovery" | "future";
          question_text: string;
          options: string[];
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["question_bank"]["Insert"]
        >;
        Relationships: [];
      };
      quiz_sessions: {
        Row: {
          id: string;
          invite_id: string;
          couple_name_1: string;
          couple_name_2: string;
          config: { q_id: string; correct_idx: number }[];
          couple_photo_url: string | null;
          love_note: string | null;
          floral_theme: string;
          color_mood: string;
          background_music: string | null;
          payment_id: string | null;
          paid: boolean;
          challenger_quiz_id: string | null;
          combined_score: number | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          invite_id: string;
          couple_name_1: string;
          couple_name_2: string;
          config: { q_id: string; correct_idx: number }[];
          couple_photo_url?: string | null;
          love_note?: string | null;
          floral_theme?: string;
          color_mood?: string;
          background_music?: string | null;
          payment_id?: string | null;
          paid?: boolean;
          challenger_quiz_id?: string | null;
          combined_score?: number | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["quiz_sessions"]["Insert"]
        >;
        Relationships: [];
      };
      quiz_taker_sessions: {
        Row: {
          id: string;
          quiz_id: string;
          taker_name: string;
          answers: { question_index: number; selected_idx: number }[];
          scores: Record<string, number>;
          soul_percentage: number;
          soul_tier:
            | "beautiful-strangers"
            | "twin-flames"
            | "architects"
            | "unified-soul";
          is_challenge: boolean;
          challenge_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          taker_name?: string;
          answers: { question_index: number; selected_idx: number }[];
          scores: Record<string, number>;
          soul_percentage: number;
          soul_tier:
            | "beautiful-strangers"
            | "twin-flames"
            | "architects"
            | "unified-soul";
          is_challenge?: boolean;
          challenge_completed?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["quiz_taker_sessions"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      media_type: MediaType;
    };
  };
}

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type Media = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
export type Rsvp = Database["public"]["Tables"]["rsvps"]["Row"];
export type RsvpInsert = Database["public"]["Tables"]["rsvps"]["Insert"];

// ── Quiz Engine Types ──
export type QuestionBankItem =
  Database["public"]["Tables"]["question_bank"]["Row"];
export type QuestionBankInsert =
  Database["public"]["Tables"]["question_bank"]["Insert"];
export type QuizSession = Database["public"]["Tables"]["quiz_sessions"]["Row"];
export type QuizSessionInsert =
  Database["public"]["Tables"]["quiz_sessions"]["Insert"];
export type QuizTakerSession =
  Database["public"]["Tables"]["quiz_taker_sessions"]["Row"];
export type QuizTakerSessionInsert =
  Database["public"]["Tables"]["quiz_taker_sessions"]["Insert"];
