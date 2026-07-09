export type ProfileRow = {
  id: string;
  name: string;
  role: string;
  email: string;
  city: string;
  bio_it: string;
  bio_en: string;
  seeking_it: string;
  seeking_en: string;
  interests: string[];
  avatar_url: string | null;
};

export type SocialRow = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  visible: boolean;
};

export type UiStringRow = {
  key: string;
  value_it: string;
  value_en: string;
};

export type TimelineRow = {
  id: string;
  year_from: number;
  year_to: number | null;
  course_it: string;
  course_en: string;
  institution_it: string;
  institution_en: string;
  body_it: string;
  body_en: string;
  sort_order: number;
};

export type ResearchRow = {
  id: string;
  title_it: string;
  title_en: string;
  body_it: string;
  body_en: string;
  sort_order: number;
};
