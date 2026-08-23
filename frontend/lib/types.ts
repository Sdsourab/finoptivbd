export type ContentType = "case_study" | "blog_post";

export interface ArticleStat {
  id: string;
  label: string;
  value: string;
  sort_order: number;
}

export interface Article {
  id: string;
  content_type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category_id: string | null;
  methodology_id: string | null;

  problem?: string | null;
  data_description?: string | null;
  method?: string | null;
  result?: string | null;
  business_implication?: string | null;
  colab_url?: string | null;
  dataset_available: boolean;
  notebook_available: boolean;
  deterministic: boolean;

  body_markdown?: string | null;
  reading_time_minutes?: number | null;

  // set when this article points to content hosted elsewhere
  external_url?: string | null;

  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  stats: ArticleStat[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  starting_price_usd: number | null;
  related_case_study_slug: string | null;
  active: boolean;
  sort_order: number;
}

export interface Prediction {
  id: string;
  article_id: string | null;
  claim: string;
  predicted_value: string;
  predicted_at: string;
  actual_value: string | null;
  resolved_at: string | null;
  error_pct: number | null;
}

export interface PipelineRun {
  id: string;
  pipeline_name: string;
  last_run_at: string;
  items_collected: number;
  status: "ok" | "error" | "running";
  note: string | null;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  related_article_slug: string | null;
  sort_order: number;
  created_at: string;
}

export interface Methodology {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}
