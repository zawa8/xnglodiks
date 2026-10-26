import { NextResponse } from "next/server";
import dict from "@/data/xnglodiks.json";
import { admin, userFromRequest } from "@/lib/server";
import { scoreQuiz } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const sb = admin();
    const user = await userFromRequest(req, sb);
    if (!user) return NextResponse.json({ error: "sain in karo" }, { status: 401 });

    const { answers } = await req.json();
    const { data: row, error } = await sb.from("quiz_attempts").select("*").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!row) return NextResponse.json({ error: "kuiz shuru nvi vua" }, { status: 400 });
    if (row.submitted_at) {
      return NextResponse.json({ state: "done", score: row.score, total: row.total, submitted_at: row.submitted_at });
    }
    if (!Array.isArray(answers) || answers.length !== row.questions.length ||
        !answers.every(a => a === null || (Number.isInteger(a) && a >= 0 && a < 4))) {
      return NextResponse.json({ error: "answers galat vain" }, { status: 400 });
    }

    const score = scoreQuiz(dict, row.questions, answers);
    const submitted_at = new Date().toISOString();
    // is("submitted_at", null) makes a double submit harmless
    const { error: upErr } = await sb.from("quiz_attempts")
      .update({ answers, score, submitted_at })
      .eq("user_id", user.id).is("submitted_at", null);
    if (upErr) throw upErr;
    return NextResponse.json({ state: "done", score, total: row.total, submitted_at });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
