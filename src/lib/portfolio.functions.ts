import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Tag, Publication, Project } from "./portfolio-types";

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const getTags = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, slug, label_en, label_it")
    .order("label_en", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Tag[];
});

export const getPublications = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("publications")
      .select(
        "id, year, authors, venue, doi, pdf_url, title_en, title_it, abstract_en, abstract_it, sort_order, publication_tags(tag:tags(id, slug, label_en, label_it))",
      )
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: any) => ({
      ...row,
      tags: (row.publication_tags ?? [])
        .map((pt: any) => pt.tag)
        .filter(Boolean) as Tag[],
    })) as Publication[];
  },
);

export const getProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, year, cover_url, link_url, title_en, title_it, summary_en, summary_it, body_en, body_it, sort_order, project_tags(tag:tags(id, slug, label_en, label_it))",
      )
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: any) => ({
      ...row,
      tags: (row.project_tags ?? [])
        .map((pt: any) => pt.tag)
        .filter(Boolean) as Tag[],
    })) as Project[];
  },
);
