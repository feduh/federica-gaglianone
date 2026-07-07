import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type {
  ProfileRow,
  SocialRow,
  UiStringRow,
  TimelineRow,
  ResearchRow,
} from "./cms-types";

function serverClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export const getProfile = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("profile")
    .select("id, name, role, email, city, bio_it, bio_en, seeking_it, seeking_en, interests, avatar_url")
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[getProfile]", error);
    return null;
  }
  if (!data) return null;
  return {
    ...data,
    interests: Array.isArray(data.interests) ? (data.interests as string[]) : [],
  } as ProfileRow;
});

export const getSocials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("socials")
    .select("id, label, href, sort_order, visible")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getSocials]", error);
    return [];
  }
  return (data ?? []) as SocialRow[];
});

export const getUiStrings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("ui_strings")
    .select("key, value_it, value_en");
  if (error) {
    console.error("[getUiStrings]", error);
    return [];
  }
  return (data ?? []) as UiStringRow[];
});

export const getTimelineEntries = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("timeline_entries")
    .select("id, year, title_it, title_en, body_it, body_en, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getTimelineEntries]", error);
    return [];
  }
  return (data ?? []) as TimelineRow[];
});

export const getResearchDirections = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("research_directions")
    .select("id, title_it, title_en, body_it, body_en, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getResearchDirections]", error);
    return [];
  }
  return (data ?? []) as ResearchRow[];
});
