import { createClient } from "@supabase/supabase-js";

// server only: uses the service role key, never import this in a client component
export function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabase env vars missing on server");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function userFromRequest(req, sb) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await sb.auth.getUser(token);
  return error ? null : data.user;
}
