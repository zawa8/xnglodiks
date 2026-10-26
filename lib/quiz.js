// pure quiz logic: takes the dictionary as an argument so it can be tested anywhere
export const TOTAL = 64;
const OPTIONS = 4;

const shuffle = (a) => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

// only clean rows: xh38 must be plain ascii (some source rows still have stray devanagari)
export function quizPool(dict) {
  return dict.filter(r => /^[\x21-\x7E]{2,}$/.test(r.xh38) && r.e26.length >= 2);
}

// type "x2e": prompt = xh38, options = e26 words, correct = row.e26
// type "e2x": prompt = e26, options = xh38 spellings, correct = row.xh38
export function makeQuiz(dict, total = TOTAL) {
  const pool = quizPool(dict);
  const picked = shuffle(pool).slice(0, total);
  const types = shuffle(picked.map((_, i) => (i < total / 2 ? "x2e" : "e2x")));
  return picked.map((row, i) => {
    const type = types[i];
    const field = type === "x2e" ? "e26" : "xh38";
    const correct = row[field];
    const near = pool.filter(c =>
      c.e26 !== row.e26 && c.xh38 !== row.xh38 && Math.abs(c[field].length - correct.length) <= 1);
    const src = near.length >= OPTIONS * 3 ? near : pool.filter(c => c.e26 !== row.e26 && c.xh38 !== row.xh38);
    const opts = new Set([correct]);
    for (const c of shuffle(src)) {
      if (opts.size === OPTIONS) break;
      opts.add(c[field]);
    }
    return { type, id: row.e26, options: shuffle([...opts]) };
  });
}

// what the browser gets: no ids, no hint of the correct option
export function publicQuestions(dict, questions) {
  const byId = new Map(dict.map(r => [r.e26, r]));
  return questions.map(q => {
    const row = byId.get(q.id);
    return { type: q.type, prompt: q.type === "x2e" ? row.xh38 : row.e26, options: q.options };
  });
}

export function scoreQuiz(dict, questions, answers) {
  const byId = new Map(dict.map(r => [r.e26, r]));
  let score = 0;
  questions.forEach((q, i) => {
    const row = byId.get(q.id);
    const correct = q.type === "x2e" ? row.e26 : row.xh38;
    const a = answers[i];
    if (Number.isInteger(a) && q.options[a] === correct) score++;
  });
  return score;
}
