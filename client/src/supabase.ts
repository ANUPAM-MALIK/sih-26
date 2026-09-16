import { createClient, type SupabaseClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
export const dataSource = supabase
  ? "Supabase connected"
  : "Demo mode · local fixtures";
export async function fetchProjects() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function fetchDashboard() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("dashboard_summary")
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
