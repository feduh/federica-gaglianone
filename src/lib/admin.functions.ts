import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden: admin only");
}

// ============== PROFILE ==============
export const upsertProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string;
    name: string; role: string; email: string; city: string;
    bio_it: string; bio_en: string; seeking_it: string; seeking_en: string;
    interests: string[]; avatar_url: string | null;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data };
    const { error } = data.id
      ? await context.supabase.from("profile").update(payload).eq("id", data.id)
      : await context.supabase.from("profile").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== SOCIALS ==============
export const upsertSocial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string; label: string; href: string; sort_order: number; visible: boolean;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = data.id
      ? await context.supabase.from("socials").update({
          label: data.label, href: data.href, sort_order: data.sort_order, visible: data.visible,
        }).eq("id", data.id)
      : await context.supabase.from("socials").insert({
          label: data.label, href: data.href, sort_order: data.sort_order, visible: data.visible,
        });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSocial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("socials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== UI STRINGS ==============
export const upsertUiString = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { key: string; value_it: string; value_en: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("ui_strings").upsert(data, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== TIMELINE ==============
export const upsertTimeline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string;
    year_from: number; year_to: number | null;
    course_it: string; course_en: string;
    institution_it: string; institution_en: string;
    body_it: string; body_en: string; sort_order: number;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = {
      year_from: data.year_from, year_to: data.year_to,
      course_it: data.course_it, course_en: data.course_en,
      institution_it: data.institution_it, institution_en: data.institution_en,
      body_it: data.body_it, body_en: data.body_en, sort_order: data.sort_order,
    };
    const { error } = data.id
      ? await context.supabase.from("timeline_entries").update(payload).eq("id", data.id)
      : await context.supabase.from("timeline_entries").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTimeline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("timeline_entries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== RESEARCH ==============
export const upsertResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string; title_it: string; title_en: string;
    body_it: string; body_en: string; sort_order: number;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = {
      title_it: data.title_it, title_en: data.title_en,
      body_it: data.body_it, body_en: data.body_en, sort_order: data.sort_order,
    };
    const { error } = data.id
      ? await context.supabase.from("research_directions").update(payload).eq("id", data.id)
      : await context.supabase.from("research_directions").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("research_directions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== TAGS ==============
export const upsertTag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id?: string; slug: string; label_it: string; label_en: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { slug: data.slug, label_it: data.label_it, label_en: data.label_en };
    const { error } = data.id
      ? await context.supabase.from("tags").update(payload).eq("id", data.id)
      : await context.supabase.from("tags").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tags").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== PUBLICATIONS ==============
export const upsertPublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string; year: number; authors: string; venue: string | null; doi: string | null;
    pdf_url: string | null; title_it: string; title_en: string;
    abstract_it: string | null; abstract_en: string | null; sort_order: number;
    tag_ids: string[];
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = {
      year: data.year, authors: data.authors, venue: data.venue, doi: data.doi,
      pdf_url: data.pdf_url, title_it: data.title_it, title_en: data.title_en,
      abstract_it: data.abstract_it, abstract_en: data.abstract_en, sort_order: data.sort_order,
    };
    let pubId = data.id;
    if (pubId) {
      const { error } = await context.supabase.from("publications").update(payload).eq("id", pubId);
      if (error) throw new Error(error.message);
    } else {
      const { data: inserted, error } = await context.supabase.from("publications").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      pubId = inserted!.id;
    }
    // reset tags
    await context.supabase.from("publication_tags").delete().eq("publication_id", pubId);
    if (data.tag_ids.length > 0) {
      const rows = data.tag_ids.map((tag_id) => ({ publication_id: pubId, tag_id }));
      const { error: tagErr } = await context.supabase.from("publication_tags").insert(rows);
      if (tagErr) throw new Error(tagErr.message);
    }
    return { ok: true, id: pubId };
  });

export const deletePublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    await context.supabase.from("publication_tags").delete().eq("publication_id", data.id);
    const { error } = await context.supabase.from("publications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== PROJECTS ==============
export const upsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as {
    id?: string; year: number; cover_url: string | null; link_url: string | null;
    title_it: string; title_en: string; summary_it: string | null; summary_en: string | null;
    body_it: string | null; body_en: string | null; sort_order: number;
    tag_ids: string[];
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = {
      year: data.year, cover_url: data.cover_url, link_url: data.link_url,
      title_it: data.title_it, title_en: data.title_en,
      summary_it: data.summary_it, summary_en: data.summary_en,
      body_it: data.body_it, body_en: data.body_en, sort_order: data.sort_order,
    };
    let projId = data.id;
    if (projId) {
      const { error } = await context.supabase.from("projects").update(payload).eq("id", projId);
      if (error) throw new Error(error.message);
    } else {
      const { data: inserted, error } = await context.supabase.from("projects").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      projId = inserted!.id;
    }
    await context.supabase.from("project_tags").delete().eq("project_id", projId);
    if (data.tag_ids.length > 0) {
      const rows = data.tag_ids.map((tag_id) => ({ project_id: projId, tag_id }));
      const { error: tagErr } = await context.supabase.from("project_tags").insert(rows);
      if (tagErr) throw new Error(tagErr.message);
    }
    return { ok: true, id: projId };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    await context.supabase.from("project_tags").delete().eq("project_id", data.id);
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== ASSET UPLOAD ==============
export const uploadAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { path: string; base64: string; contentType: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const binary = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error } = await context.supabase.storage
      .from("public-assets")
      .upload(data.path, binary, { contentType: data.contentType, upsert: true });
    if (error) throw new Error(error.message);
    // Bucket is private (workspace policy blocks public buckets) — serve through
    // the same-origin read-only proxy route instead of a Supabase public URL.
    return { url: `/api/public/asset/${data.path.split("/").map(encodeURIComponent).join("/")}` };
  });

// ============== STORAGE: LIST / DELETE (media library) ==============
export const listAssets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => (d ?? {}) as { prefix?: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const prefixes = ["projects-cover", "avatars", "publications", ""];
    const wanted = data?.prefix ? [data.prefix] : prefixes;
    const out: { path: string; name: string; size: number; updated_at: string | null; url: string }[] = [];
    for (const pfx of wanted) {
      const { data: files, error } = await context.supabase.storage
        .from("public-assets")
        .list(pfx, { limit: 200, sortBy: { column: "updated_at", order: "desc" } });
      if (error) continue;
      for (const f of files ?? []) {
        if (!f.id) continue; // folder placeholder
        const path = pfx ? `${pfx}/${f.name}` : f.name;
        out.push({
          path,
          name: f.name,
          size: (f.metadata as any)?.size ?? 0,
          updated_at: f.updated_at ?? null,
          url: `/api/public/asset/${path.split("/").map(encodeURIComponent).join("/")}`,
        });
      }
    }
    return { files: out };
  });

export const deleteAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { path: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.storage.from("public-assets").remove([data.path]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============== GENERIC REORDER ==============
const REORDERABLE = [
  "timeline_entries",
  "publications",
  "projects",
  "research_directions",
  "socials",
] as const;

export const reorderRows = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d as { table: string; ids: string[] })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (!(REORDERABLE as readonly string[]).includes(data.table)) {
      throw new Error("Table not reorderable");
    }
    for (let i = 0; i < data.ids.length; i++) {
      const { error } = await context.supabase
        .from(data.table as any)
        .update({ sort_order: i })
        .eq("id", data.ids[i]!);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============== AUTH: CHECK ROLE ==============
export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId, _role: "admin",
    });
    return { isAdmin: !!data };
  });
