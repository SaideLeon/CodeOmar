import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gmdxjmqlyjjochdxdooh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mz7zwem7RctVA80FD9lBxw_y0xR9NWV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
