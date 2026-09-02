import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkpztjsghbfdeiumzkau.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcHp0anNnaGJmZGVpdW16a2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDczMTgsImV4cCI6MjEwMzgyMzMxOH0.XA4K3Fbc669mUp2agZtie12eBSeuBQt_6y5D9qVsLyE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
