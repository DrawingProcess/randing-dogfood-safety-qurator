import type { PetType } from "@/lib/types";

const aliases: Record<string, string[]> = {
  response_id: ["response_id", "responseId"],
  pet_type: ["pet_type", "petType", "반려동물"],
  age_group: ["age_group", "ageGroup", "나이"],
  weight_group: ["weight_group", "weightGroup", "체중"],
  breed: ["breed", "견종", "묘종", "견종/묘종"],
  pet_count: ["pet_count", "petCount", "반려동물 수"],
  current_food: ["current_food", "currentFood", "현재 사료"],
  current_brand: ["current_brand", "currentBrand", "브랜드"],
  purchase_channel: ["purchase_channel", "purchaseChannel", "구매 채널"],
  purchase_frequency: ["purchase_frequency", "purchaseFrequency", "구매 빈도"],
  monthly_spend: ["monthly_spend", "monthlySpend", "월평균 지출"],
  snack_frequency: ["snack_frequency", "snackFrequency", "간식 구매 빈도"],
  main_concerns: ["main_concerns", "mainConcerns", "고민"],
  ingredient_concern: ["ingredient_concern", "성분 논란 인지"],
  allergy_concern: ["allergy_concern", "알레르기"],
  palatability_concern: ["palatability_concern", "기호성"],
  origin_concern: ["origin_concern", "원산지"],
  manufacturing_concern: ["manufacturing_concern", "제조 과정"],
  service_interest: ["service_interest", "서비스 관심도"],
  desired_features: ["desired_features", "desiredFeatures", "원하는 기능"],
  comparison_friction: ["comparison_friction", "비교 불편"],
  safety_mark_interest: ["safety_mark_interest", "안심 마크 관심"],
  future_purchase_intent: ["future_purchase_intent", "이용 의향"],
  expected_purchase_frequency: ["expected_purchase_frequency", "예상 구매 빈도"],
  expected_spend: ["expected_spend", "예상 구매 금액"],
  interested_categories: ["interested_categories", "관심 카테고리"],
  interview_interest: ["interview_interest", "인터뷰 의향"],
  other_opinion: ["other_opinion", "기타 의견", "의견"],
};

function readField(row: Record<string, unknown>, key: string) {
  for (const alias of aliases[key] ?? [key]) {
    if (row[alias] !== undefined && row[alias] !== null && row[alias] !== "") return row[alias];
  }
  return null;
}

function asText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

function asList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,，/|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function asPet(value: unknown): PetType | null {
  const text = asText(value);
  if (!text) return null;
  if (text === "dog" || text.includes("강아지") || text.includes("개")) return "dog";
  if (text === "cat" || text.includes("고양이") || text.includes("냥")) return "cat";
  return null;
}

export function normalizeSurveyRow(row: Record<string, unknown>) {
  const petCount = readField(row, "pet_count");
  const parsedCount = typeof petCount === "number" ? petCount : Number(asText(petCount));
  return {
    response_id: asText(readField(row, "response_id")),
    pet_type: asPet(readField(row, "pet_type")),
    age_group: asText(readField(row, "age_group")),
    weight_group: asText(readField(row, "weight_group")),
    breed: asText(readField(row, "breed")),
    pet_count: Number.isFinite(parsedCount) ? parsedCount : null,
    current_food: asText(readField(row, "current_food")),
    current_brand: asText(readField(row, "current_brand")),
    purchase_channel: asText(readField(row, "purchase_channel")),
    purchase_frequency: asText(readField(row, "purchase_frequency")),
    monthly_spend: asText(readField(row, "monthly_spend")),
    snack_frequency: asText(readField(row, "snack_frequency")),
    main_concerns: asList(readField(row, "main_concerns")),
    ingredient_concern: asText(readField(row, "ingredient_concern")),
    allergy_concern: asText(readField(row, "allergy_concern")),
    palatability_concern: asText(readField(row, "palatability_concern")),
    origin_concern: asText(readField(row, "origin_concern")),
    manufacturing_concern: asText(readField(row, "manufacturing_concern")),
    service_interest: asText(readField(row, "service_interest")),
    desired_features: asList(readField(row, "desired_features")),
    comparison_friction: asText(readField(row, "comparison_friction")),
    safety_mark_interest: asText(readField(row, "safety_mark_interest")),
    future_purchase_intent: asText(readField(row, "future_purchase_intent")),
    expected_purchase_frequency: asText(readField(row, "expected_purchase_frequency")),
    expected_spend: asText(readField(row, "expected_spend")),
    interested_categories: asText(readField(row, "interested_categories")),
    interview_interest: asText(readField(row, "interview_interest")),
    other_opinion: asText(readField(row, "other_opinion")),
    free_text: {},
  };
}
