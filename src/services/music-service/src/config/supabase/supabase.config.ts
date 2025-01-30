import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseURL || !supabaseKey) {
    throw new Error("Environment variables SUPABASE_URL and SUPABASE_KEY must be set");
}

const supabase = createClient(supabaseURL, supabaseKey);

export { supabase };

