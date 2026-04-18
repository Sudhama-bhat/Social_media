import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) console.error("CRITICAL: SUPABASE_URL is missing!");
if (!supabaseKey) console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is missing!");
if (supabaseUrl && supabaseKey) console.log("Supabase client initialized with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);
