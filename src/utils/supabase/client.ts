import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Get Supabase configuration
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'eazibook-web@1.0.0',
    },
    fetch: (url, options = {}) => {
      // Add timeout to all fetch requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_id: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      companies: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string;
          logo_url: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          customer_code: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          company_name: string | null;
          address: string | null;
          city: string | null;
          country: string;
          balance: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          sku: string | null;
          name: string;
          description: string | null;
          type: string;
          category: string | null;
          unit: string;
          price: number;
          cost: number;
          tax_rate: number;
          stock_quantity: number;
          low_stock_threshold: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      suppliers: {
        Row: {
          id: string;
          company_id: string;
          supplier_code: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          company_name: string | null;
          address: string | null;
          city: string | null;
          country: string;
          balance: number;
          payment_terms: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string | null;
          invoice_number: string;
          invoice_date: string;
          due_date: string | null;
          status: string;
          currency: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          amount_paid: number;
          balance_due: number;
          notes: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          company_id: string;
          transaction_date: string;
          type: string;
          category: string | null;
          description: string;
          amount: number;
          payment_method: string | null;
          reference_number: string | null;
          status: string;
          reconciled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          plan_type: string;
          status: string;
          start_date: string;
          end_date: string | null;
          invoices_limit: number;
          bills_limit: number;
          invoices_used: number;
          bills_used: number;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
  };
}
