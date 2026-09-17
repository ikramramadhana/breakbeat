import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Song = {
  id: string;
  title: string;
  artist: string | null;
  file_url: string;
  duration_seconds: number | null;
  sort_order: number | null;
};
