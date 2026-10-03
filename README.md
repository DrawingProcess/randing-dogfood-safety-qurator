# 믿고멍냥

반려동물 먹거리 큐레이션 마켓의 고객검증 MVP입니다. 결제, 장바구니, 회원 기능은 없습니다. 무료 샘플은 판매 상품이 아니라 오픈 전 반응을 보는 이벤트입니다.

상품은 `/admin/products`에서 추가한 목록을 보여줍니다.

## 실행

```bash
npm install
npm run dev
```

상품 목록, 이벤트 저장, `/analysis` 집계, 상품 저장은 Supabase 환경변수가 있어야 동작합니다.

## 환경변수

`.env.example`을 `.env.local`로 복사합니다.

| 이름 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 상품 조회, 이벤트 기록 |
| `SUPABASE_SERVICE_ROLE_KEY` | 분석 집계, 상품/뱃지 저장, 설문 가져오기 |
| `NEXT_PUBLIC_GOOGLE_FORM_URL` | 샘플 페이지 마지막 설문 링크. 코드에 URL을 넣지 않습니다. |
| `ANALYSIS_PASSWORD` | `/analysis`와 `/admin` 비밀번호 |

## 데이터베이스

Supabase SQL Editor에서 순서대로 실행합니다.

1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_delete_seed_products.sql` (처음 넣었던 가상 시드 상품 20개만 삭제)

`product-images` 버킷 정책도 마이그레이션에 포함되어 있습니다. 상품 이미지를 파일로 올리면 이 버킷에 저장됩니다.

## 페이지

- `/` 랜딩. 샘플 신청은 맨 아래 한 곳입니다.
- `/products` 강아지/고양이, 사료/간식, 크기·연령 필터
- `/products/[id]` 제조 정보와 확인 뱃지. 결제는 없습니다.
- `/sample` 강아지/고양이 질문 후 Google Form
- `/analysis` 방문자, 퍼널, 상품, 반려동물, 카테고리, 설문
- `/admin/products` 상품과 뱃지 추가/수정/삭제

## 이벤트

첫 방문 때 `localStorage`에 `session_id`를 만들고 같은 값을 모든 이벤트에 넣습니다.

`page_view`, `pet_type_selected`, `category_view`, `product_card_clicked`, `product_detail_viewed`, `sample_cta_clicked`, `sample_page_viewed`, `sample_pet_type_selected`, `sample_form_started`, `sample_form_completed`, `google_form_clicked`, `navigation_clicked`

퍼널은 세션 수 기준입니다. 랜딩 방문 → 상품 상세 → 샘플 CTA → 샘플 페이지 → Google Form.

## 설문

Google Form 원문은 사이트에 넣지 않습니다. 응답을 대시보드에 보려면 `/analysis` 하단 JSON 가져오기를 사용합니다. `response_id`가 같으면 갱신됩니다.

예시:

```json
[
  {
    "response_id": "form-1",
    "pet_type": "dog",
    "breed": "믹스",
    "current_brand": "가상 브랜드",
    "purchase_channel": "온라인",
    "purchase_frequency": "월 1회",
    "monthly_spend": "5만원",
    "main_concerns": ["성분", "기호성"],
    "desired_features": ["안심 마크", "상품 비교"],
    "other_opinion": "성분표를 비교하기 어렵습니다."
  }
]
```

처음 넣었던 가상 시드 상품을 지우려면 Supabase SQL Editor에서 `002_delete_seed_products.sql`을 실행합니다. 직접 추가한 상품은 그대로 둡니다.
