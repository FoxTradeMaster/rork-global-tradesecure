import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing configuration:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl,
  });
}

let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || supabaseUrl === 'undefined' || supabaseUrl === 'null' || supabaseUrl.length < 10 ||
    !supabaseAnonKey || supabaseAnonKey === 'undefined' || supabaseAnonKey === 'null' || supabaseAnonKey.length < 10) {
  console.warn('[Supabase] Configuration missing or invalid. App will run with mock data only.');
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: ReturnType<typeof createClient>;

if (!supabaseUrl || supabaseUrl === 'undefined' || supabaseUrl === 'null' || supabaseUrl.length < 10 ||
    !supabaseServiceRoleKey || supabaseServiceRoleKey === 'undefined' || supabaseServiceRoleKey === 'null' || supabaseServiceRoleKey.length < 10) {
  console.warn('[Supabase Admin] Service role key missing. Admin operations will be limited.');
  supabaseAdmin = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
} else {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export { supabase, supabaseAdmin };

export interface Database {
  public: {
    Tables: {
      market_participants: {
        Row: {
          id: string;
          name: string;
          type: string;
          headquarters: string;
          description: string;
          verified: boolean;
          website?: string;
          commodities: string[];
          category?: string[];
          offices?: string[];
          licenses?: string[];
          specialization?: string;
          business_type?: string;
          logo?: string;
          brand_color?: string;
          email?: string;
          contact_links?: any;
          founded?: number;
          trading_volume?: string;
          broker_type?: string[];
          regulated_by?: string[];
          clearing_relationships?: string[];
          license_numbers?: any[];
          framework?: string;
          members?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['market_participants']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['market_participants']['Insert']>;
      };
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
