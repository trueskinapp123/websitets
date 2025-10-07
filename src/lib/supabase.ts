import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xnlsijpognudxyoswajm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
