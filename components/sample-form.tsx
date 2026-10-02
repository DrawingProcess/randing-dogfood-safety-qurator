"use client";

import { useState } from "react";
import type { PetType } from "@/lib/types";
import { TrackOnMount, trackEvent } from "@/components/track";

const dogQuestions = {
  age: ["퍼피", "어덜트", "시니어"],
  weight: ["5kg 미만", "5~10kg", "10~20kg", "20kg 이상"],
  food: ["건사료", "습식사료", "동결건조", "화식", "기타"],
  concerns: ["성분", "알레르기", "기호성", "소화/변 상태", "체중 관리", "피부/털", "원산지", "제조 과정", "가격", "기타"],
  frequencyLabel: "간식 섭취 빈도",
  frequency: ["거의 먹지 않음", "하루 1회", "하루 2~3회", "그 이상"],
  breedLabel: "견종",
};

const catQuestions = {
  age: ["키튼", "어덜트", "시니어"],
  weight: ["3kg 미만", "3~5kg", "5~7kg", "7kg 이상"],
  food: ["건사료", "습식사료", "동결건조", "기타"],
  concerns: ["성분", "알레르기", "기호성", "음수량", "체중 관리", "헤어볼", "소화/변 상태", "원산지", "제조 과정", "가격", "기타"],
  frequencyLabel: "습식사료/간식 섭취 빈도",
  frequency: ["거의 먹지 않음", "가끔", "하루 1회", "하루 2회 이상"],
  breedLabel: "묘종",
};

type Answers = {
  age: string;
  weight: string;
  breed: string;
  food: string;
  brand: string;
  concerns: string[];
  avoid: string;
  frequency: string;
};

const emptyAnswers: Answers = { age: "", weight: "", breed: "", food: "", brand: "", concerns: [], avoid: "", frequency: "" };

export function SampleForm({ googleFormUrl, productId }: { googleFormUrl: string; productId?: string }) {
  const [pet, setPet] = useState<PetType | null>(null);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const questions = pet === "cat" ? catQuestions : dogQuestions;

  function choosePet(next: PetType) {
    setPet(next);
    setAnswers(emptyAnswers);
    setDone(false);
    setStarted(false);
    trackEvent({
      event_name: "sample_pet_type_selected",
      pet_type: next,
      product_id: productId,
      page: "/sample",
      metadata: { source: "sample" },
    });
    trackEvent({ event_name: "pet_type_selected", pet_type: next, page: "/sample", metadata: { source: "sample" } });
  }

  function markStarted() {
    if (started || !pet) return;
    setStarted(true);
    trackEvent({ event_name: "sample_form_started", pet_type: pet, product_id: productId, page: "/sample" });
  }

  function update(partial: Partial<Answers>) {
    markStarted();
    setAnswers((current) => ({ ...current, ...partial }));
  }

  function toggleConcern(concern: string) {
    markStarted();
    setAnswers((current) => ({
      ...current,
      concerns: current.concerns.includes(concern)
        ? current.concerns.filter((item) => item !== concern)
        : [...current.concerns, concern],
    }));
  }

  function complete() {
    if (!pet || !answers.age || !answers.weight || !answers.food || !answers.frequency || answers.concerns.length === 0) return;
    setDone(true);
    trackEvent({
      event_name: "sample_form_completed",
      pet_type: pet,
      product_id: productId,
      page: "/sample",
      metadata: {
        age: answers.age,
        weight: answers.weight,
        food: answers.food,
        frequency: answers.frequency,
        concerns: answers.concerns,
      },
    });
  }

  const ready = Boolean(pet && answers.age && answers.weight && answers.food && answers.frequency && answers.concerns.length);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <TrackOnMount event_name="sample_page_viewed" page="/sample" product_id={productId ?? null} />
      <p className="text-sm font-medium text-forest">샘플은 정식 상품이 아니라, 오픈 전 의견을 듣기 위한 이벤트입니다.</p>
      <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">우리 아이에게 맞는 먹거리를 찾아볼게요.</h1>
      <p className="mt-4 leading-8 text-muted">모든 아이에게 같은 먹거리가 맞는 것은 아니니까요. 몇 가지 정보를 알려주시면 우리 아이에게 더 잘 맞는 먹거리를 준비하는 데 참고하겠습니다.</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold">어떤 아이인가요?</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {([["dog", "🐶 강아지"], ["cat", "🐱 고양이"]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => choosePet(value)}
              className={`rounded-3xl border px-4 py-6 text-lg font-semibold ${pet === value ? "border-forest bg-leaf" : "border-line bg-card"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {pet ? (
        <div className="mt-8 space-y-8">
          <ChoiceGroup label="나이" options={questions.age} value={answers.age} onChange={(age) => update({ age })} />
          <ChoiceGroup label="체중" options={questions.weight} value={answers.weight} onChange={(weight) => update({ weight })} />
          <label className="block">
            <span className="font-semibold">{questions.breedLabel}</span>
            <input value={answers.breed} onChange={(event) => update({ breed: event.target.value })} className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3" placeholder="모르면 비워 두셔도 됩니다" />
          </label>
          <ChoiceGroup label="현재 주식으로 먹고 있는 것은?" options={questions.food} value={answers.food} onChange={(food) => update({ food })} />
          <label className="block">
            <span className="font-semibold">현재 먹고 있는 사료의 브랜드/제품명이 있다면?</span>
            <input value={answers.brand} onChange={(event) => update({ brand: event.target.value })} className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3" />
          </label>
          <fieldset>
            <legend className="font-semibold">사료/간식을 고를 때 가장 신경 쓰이는 것은?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {questions.concerns.map((concern) => {
                const selected = answers.concerns.includes(concern);
                return (
                  <button key={concern} type="button" aria-pressed={selected} onClick={() => toggleConcern(concern)} className={`rounded-full border px-3 py-2 text-sm ${selected ? "border-forest bg-leaf" : "border-line bg-card"}`}>
                    {concern}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="block">
            <span className="font-semibold">특별히 피하고 싶은 원료나 성분이 있나요?</span>
            <textarea value={answers.avoid} onChange={(event) => update({ avoid: event.target.value })} className="mt-2 min-h-24 w-full rounded-2xl border border-line bg-card px-4 py-3" />
          </label>
          <ChoiceGroup label={questions.frequencyLabel} options={questions.frequency} value={answers.frequency} onChange={(frequency) => update({ frequency })} />
          <button type="button" disabled={!ready} onClick={complete} className="rounded-full bg-forest px-5 py-3 font-semibold text-white disabled:opacity-40">
            이 정보로 다음 단계 보기
          </button>
        </div>
      ) : null}

      {done ? (
        <section className="mt-10 rounded-[2rem] bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold">조금 더 자세히 알려주시면 더 잘 준비할 수 있어요 🐥</h2>
          <p className="mt-3 leading-7 text-muted">사료는 아이마다 먹는 양도, 선호도도, 고민도 다릅니다. 그래서 여러분이 알려주신 정보를 바탕으로 <strong className="text-ink">더 잘 맞는 먹거리를 준비하기 위해</strong> 간단한 추가 설문을 받고 있습니다. 약 2분 정도 소요됩니다.</p>
          {googleFormUrl ? (
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-yellow px-5 py-3 font-semibold"
              onClick={() =>
                trackEvent({
                  event_name: "google_form_clicked",
                  page: "/sample",
                  pet_type: pet,
                  product_id: productId,
                })
              }
            >
              우리 아이 정보 더 알려주기 →
            </a>
          ) : (
            <p className="mt-6 rounded-2xl bg-yellow px-4 py-3 text-sm">추가 설문 링크를 준비 중입니다. NEXT_PUBLIC_GOOGLE_FORM_URL을 설정하면 이 버튼이 연결됩니다.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}

function ChoiceGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="font-semibold">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`rounded-full border px-3 py-2 text-sm ${value === option ? "border-forest bg-yellow" : "border-line bg-card"}`}>
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
