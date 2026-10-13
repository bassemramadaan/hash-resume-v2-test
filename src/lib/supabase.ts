import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel / environment.'
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// أنواع البيانات (هتستخدمها بعدين)
export type CvRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  years_experience: number | null;
  field: string | null;
  country: string | null;
  city: string | null;
  resume_data: Record<string, unknown>;
  pdf_url: string | null;
  allow_sharing: boolean;
  status: 'active' | 'hidden' | 'deleted';
};

export type CompanyRow = {
  id: string;
  created_at: string;
  company_name: string;
  contact_email: string;
  is_active: boolean;
  credits_remaining: number;
  subscription_type: 'none' | 'basic' | 'pro' | 'enterprise';
};
