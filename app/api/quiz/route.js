import { NextResponse } from "next/server";
import dict from "@/data/xnglodiks.json";
import { admin, userFromRequest } from "@/lib/server";
import { TOTAL, makeQuiz, publicQuestions } from "@/lib/quiz";

export const dynamic = "force-dynamic";

function view(row) {
  if (row.submitted_at) {
    return { state: "done", score: row.score, total: row.total, submitted_at: row.submitted_at };
  }
  return { state: "inprogress", questions: publicQuestions(dict, row.questions) };
}

async function load(sb, uid) {
  const { data, error } = await sb.from("quiz_attempts").select("*").eq("user_id", uid).maybeSingle();
  if (error) throw error;
  return data;
}

// status / resume
export async function GET(req) {
  try {
    const sb = admin();
    const user = await userFromRequest(req, sb);
    if (!user) return NextResponse.json({ error: "sain in karo" }, { status: 401 });
    const row = await load(sb, user.id);
    return NextResponse.json(row ? view(row) : { state: "none", total: TOTAL });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// start: one attempt per user, a second call just returns the same attempt
export async function POST(req) {
  try {
    const sb = admin();
    const user = await userFromRequest(req, sb);
    if (!user) return NextResponse.json({ error: "sain in karo" }, { status: 401 });
    let row = await load(sb, user.id);
    if (!row) {
      const { error } = await sb.from("quiz_attempts").insert({
        user_id: user.id, questions: makeQuiz(dict), total: TOTAL,
      });
      if (error && error.code !== "23505") throw error;
      row = await load(sb, user.id);
    }
    return NextResponse.json(view(row));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
