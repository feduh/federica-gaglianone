export type Tag = {
  id: string;
  slug: string;
  label_en: string;
  label_it: string;
};

export type Publication = {
  id: string;
  year: number;
  authors: string;
  venue: string | null;
  doi: string | null;
  pdf_url: string | null;
  title_en: string;
  title_it: string;
  abstract_en: string | null;
  abstract_it: string | null;
  sort_order: number;
  tags: Tag[];
};

export type Project = {
  id: string;
  year: number;
  cover_url: string | null;
  link_url: string | null;
  title_en: string;
  title_it: string;
  summary_en: string | null;
  summary_it: string | null;
  body_en: string | null;
  body_it: string | null;
  sort_order: number;
  tags: Tag[];
};
