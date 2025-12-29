import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      counterparties: {
        Row: {
          id: string;
          name: string;
          country: string;
          type: 'buyer' | 'seller';
          email: string;
          phone?: string;
          onboarded_at: string;
          risk_score: any;
          documents: any;
          approved: boolean;
          approval_conditions?: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['counterparties']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['counterparties']['Insert']>;
      };
      trades: {
        Row: {
          id: string;
          commodity: string;
          counterparty_id: string;
          counterparty_name: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          total_value: number;
          currency: string;
          incoterm: string;
          delivery_window: any;
          status: string;
          created_by: string;
          documents: any;
          risk_level: string;
          alerts: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trades']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trades']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          type: string;
          name: string;
          entity_type: 'counterparty' | 'trade';
          entity_id: string;
          uploaded_by: string;
          url: string;
          verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
    };
  };
}
