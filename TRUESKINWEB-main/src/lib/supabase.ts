import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqkyzoybguicxuxiksmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3l6b3liZ3VpY3h1eGlrc21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjI1MzYsImV4cCI6MjA3Mzc5ODUzNn0.vVVVoV5yvVvbDGAcw8Yqn5UeDg-qovOdL5MXDCFv7JU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
