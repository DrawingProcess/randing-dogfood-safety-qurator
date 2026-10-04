import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/env";
import { runtimeEnv } from "@/lib/runtime-env";

function samePassword(input: string, expected: string) {
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < input.length; index += 1) {
    mismatch |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function POST(request: Request) {
  const expected = runtimeEnv("ANALYSIS_PASSWORD");
  if (!expected) {
    return NextResponse.json({ error: "ANALYSIS_PASSWORD 환경변수가 설정되지 않았습니다." }, { status: 500 });
  }

  let password = "";
  const header = request.headers.get("x-analysis-password");
  if (header) {
    password = header;
  } else {
    try {
      const body = (await request.json()) as { password?: unknown };
      if (typeof body.password === "string") password = body.password;
    } catch {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }
  }

  if (!samePassword(password, expected)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  if (!hasServiceRole()) {
    return NextResponse.json({ error: "Supabase service role 키가 없습니다." }, { status: 500 });
  }
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase에 연결하지 못했습니다." }, { status: 500 });
  }

  const before = await client.from("analytics_events").select("id", { count: "exact", head: true });
  if (before.error) {
    return NextResponse.json({ error: before.error.message }, { status: 500 });
  }

  const { count, error } = await client
    .from("analytics_events")
    .delete({ count: "exact" })
    .gte("created_at", "1970-01-01");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    before: before.count ?? 0,
    deleted: count ?? 0,
  });
}
