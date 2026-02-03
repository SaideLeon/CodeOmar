import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lklydqknwbbbzwxnvguj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrbHlkcWtud2JiYnp3eG52Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NzY2ODksImV4cCI6MjAzMjA1MjY4OX0.3u713lqSKyILm65z9wz5uD4_TbF4hB23Y_LStJHO2F8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
