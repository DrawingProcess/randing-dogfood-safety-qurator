"use client";

import { useActionState } from "react";
import { saveProduct } from "@/lib/actions";
import { badgeCatalog, badgeOrder } from "@/lib/badges";
import { catSizes, categoryLabels, dogSizes, petLabels, sizeLabels } from "@/lib/labels";
import type { Product } from "@/lib/types";

export function AdminProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const creating = !product;
  return (
    <form action={action} className="grid gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <Field label="상품명" name="name" defaultValue={product?.name} required />
      <Field label="브랜드" name="brand" defaultValue={product?.brand} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="강아지/고양이" name="pet_type" defaultValue={product?.pet_type ?? "dog"} options={[["dog", petLabels.dog], ["cat", petLabels.cat]]} />
        <Select label="카테고리" name="category" defaultValue={product?.category ?? "food"} options={[["food", categoryLabels.food], ["snack", categoryLabels.snack]]} />
        <Select label="대상 크기/연령" name="size_type" defaultValue={product?.size_type ?? "all"} options={[...dogSizes, ...catSizes.filter((size) => size !== "all")].map((size) => [size, sizeLabels[size]])} />
        <Field label="가격" name="price" type="number" defaultValue={product ? String(product.price) : ""} required />
      </div>
      <Field label="짧은 설명" name="description" defaultValue={product?.description} />
      <label className="block text-sm font-semibold">
        상세 설명
        <textarea name="detail_description" defaultValue={product?.detail_description} className="mt-2 min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="제조사" name="manufacturer" defaultValue={product?.manufacturer} />
        <Field label="제조국" name="country_of_origin" defaultValue={product?.country_of_origin} />
        <Field label="제조 방식" name="manufacturing_method" defaultValue={product?.manufacturing_method} />
        <Field label="주요 단백질" name="main_protein" defaultValue={product?.main_protein} />
      </div>
      <Field label="이미지 URL" name="image_url" defaultValue={product?.image_url} />
      <label className="block text-sm font-semibold">
        이미지 파일
        <input name="image" type="file" accept="image/*" className="mt-2 block w-full text-sm font-normal" />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="is_handmade" type="checkbox" defaultChecked={product?.is_handmade} />
        수제
      </label>
      <Select label="상태" name="status" defaultValue={product?.status ?? "active"} options={[["active", "활성"], ["inactive", "비활성"]]} />
      {creating ? (
        <fieldset>
          <legend className="text-sm font-semibold">안심 마크</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {badgeOrder.map((type) => (
              <label key={type} className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm">
                <input type="checkbox" name="badge_type" value={type} />
                {badgeCatalog[type].label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button disabled={pending} className="w-fit rounded-full bg-forest px-5 py-3 font-semibold text-white disabled:opacity-50">
        {pending ? "저장 중" : "저장"}
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal" />
    </label>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: Array<[string, string]> }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal">
        {options.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
    </label>
  );
}
