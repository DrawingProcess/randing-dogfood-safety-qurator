"use client";

import { useActionState } from "react";
import { unlockGate } from "@/lib/actions";

export function GateForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(unlockGate, null);
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold text-forest">믿고멍냥</p>
      <h1 className="mt-2 text-3xl font-bold">팀 확인</h1>
      <p className="mt-3 text-sm leading-6 text-muted">분석과 상품 관리는 프로젝트 팀만 볼 수 있습니다. 일반 고객 화면에는 이 페이지로 가는 링크를 두지 않습니다.</p>
      <form action={action} className="mt-6 space-y-3 rounded-3xl border border-line bg-card p-5">
        <input type="hidden" name="next" value={nextPath} />
        <label className="block text-sm font-semibold" htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" className="w-full rounded-2xl border border-line px-4 py-3" />
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        <button disabled={pending} className="w-full rounded-full bg-forest py-3 font-semibold text-white disabled:opacity-50">
          {pending ? "확인 중" : "들어가기"}
        </button>
      </form>
    </main>
  );
}
