export const petTypes = ["dog", "cat"] as const;
export const categories = ["food", "snack"] as const;
export const sizeTypes = ["small", "medium", "large", "kitten", "adult", "senior", "all"] as const;
export const productStatuses = ["active", "inactive"] as const;
export const badgeTypes = [
  "ingredient_checked",
  "manufacturing_checked",
  "korea_made",
  "single_protein",
  "handmade",
] as const;

export const eventNames = [
  "page_view",
  "pet_type_selected",
  "category_view",
  "product_card_clicked",
  "product_detail_viewed",
  "sample_cta_clicked",
  "sample_page_viewed",
  "sample_pet_type_selected",
  "sample_form_started",
  "sample_form_completed",
  "google_form_clicked",
  "navigation_clicked",
] as const;

export type PetType = (typeof petTypes)[number];
export type Category = (typeof categories)[number];
export type SizeType = (typeof sizeTypes)[number];
export type ProductStatus = (typeof productStatuses)[number];
export type BadgeType = (typeof badgeTypes)[number];
export type EventName = (typeof eventNames)[number];

export type ProductBadge = {
  id: string;
  product_id: string;
  badge_type: BadgeType | string;
  badge_label: string;
  description: string;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  alt_text: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: Category;
  pet_type: PetType;
  size_type: SizeType;
  price: number;
  brand: string;
  manufacturer: string;
  country_of_origin: string;
  is_handmade: boolean;
  manufacturing_method: string;
  main_protein: string;
  image_url: string;
  detail_description: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  badges: ProductBadge[];
  images: ProductImage[];
};

export type AnalyticsEventInput = {
  session_id: string;
  event_name: EventName;
  page?: string;
  product_id?: string | null;
  pet_type?: PetType | null;
  metadata?: Record<string, unknown>;
};

export type SurveyResponse = {
  id: string;
  response_id: string | null;
  pet_type: PetType | null;
  age_group: string | null;
  weight_group: string | null;
  breed: string | null;
  pet_count: number | null;
  current_food: string | null;
  current_brand: string | null;
  purchase_channel: string | null;
  purchase_frequency: string | null;
  monthly_spend: string | null;
  snack_frequency: string | null;
  main_concerns: string[];
  ingredient_concern: string | null;
  allergy_concern: string | null;
  palatability_concern: string | null;
  origin_concern: string | null;
  manufacturing_concern: string | null;
  service_interest: string | null;
  desired_features: string[];
  comparison_friction: string | null;
  safety_mark_interest: string | null;
  future_purchase_intent: string | null;
  expected_purchase_frequency: string | null;
  expected_spend: string | null;
  interested_categories: string | null;
  interview_interest: string | null;
  other_opinion: string | null;
  free_text: Record<string, unknown>;
  created_at: string;
};

export type ProductFilter = {
  pet?: PetType;
  category?: Category;
  size?: SizeType;
  includeInactive?: boolean;
};
