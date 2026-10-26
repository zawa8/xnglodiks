# CLAUDE.md

## project
xnglodiks = dictionary project. one dictionary (csv/json) is the shared data for:
1. this nextjs app (deployed on vercel)
2. the xndroid app

repo: github.com/zawa8/xnglodiks

## dictionary columns
- `e26`: normal english word (26 letter alphabet)
- `e23`: lowercase english, spelled by sound with 23 letters: `j->z`, `q->k`, `v->w`. alphabet = `abcdefghizklmnprstuwxy`. `a` = A as in cat (kat), `aa` = aa sound as in car (kaar)
- `xh38`: 38 character based xnglo hindi. phonetically `x`=A, `v`=H

example rows:
```
e26,e23,xh38
cat,kat,kxt
car,kaar,kaar
jahaj,zahaaz,zvaz
```

## data source
- 3005 rows come from the first 3 columns (`e52,e23,x38`) of `data/3k_local_copy.tsv` in github.com/zawa8/xnglo; renamed to `e26,e23,xh38`
- some xh38 values still contain stray devanagari characters (clean them in the source tsv, then regenerate)

## app
- `app/search.js`: regex word search over a chosen column (default xh38), options: whole word, case sensitive (default on, xh38 letters are case sensitive)

## auth + quiz (supabase)
- login: email otp or mobile otp via supabase auth (`app/login/page.js`). client in `lib/supabase.js` (returns null when env missing)
- header menu: `components/Header.jsx` (home, kuiz, sain in / sain aut)
- quiz: `app/quiz/page.js`, 64 mcq, 4 options, one attempt per user. questions made server side in `lib/quiz.js` (32 xh38->e26, 32 e26->xh38, only ascii xh38 rows)
- api: `app/api/quiz/route.js` (GET status/resume, POST start), `app/api/quiz/submit/route.js` (scores server side). server helper `lib/server.js` uses the service role key, never import it in client code
- db: `supabase/schema.sql` (table `quiz_attempts`, user_id is primary key = one attempt, rls: users only read their own row, writes only via api)
- env vars: see `.env.example` (3 vars, also set them in vercel)

## files
- `data/xnglodiks.csv` and `data/xnglodiks.json`: the dictionary, must stay identical in content. csv is the header `e26,e23,xh38`, json is an array of `{e26, e23, xh38}`
- `public/xnglodiks.json`: copy of the json for the xndroid app to fetch. update it whenever `data/xnglodiks.json` changes
- `app/`: nextjs app router (`page.js` loads the json, `search.js` is the search table)
- `components/`: shared components copied from github.com/zawa8/xngloai `web/components`
  - `AuthButton.jsx` (needs `next-auth`, google sign in), `BekBatan.jsx` (back button), `LanguagePicker.jsx`
  - `hsciifp/`: font helpers (`varfonts.js`, `LocalFontPicker.jsx`, `MicButton.jsx`) and the 38 char fonts in `xnglofonts/*.woff2`
- `lib/LanguageContext.jsx`: language provider used by `LanguagePicker`
- `data/xnglo_languages.json`: language codes (xh38 etc) with their fonts
- `jsconfig.json`: `@/` alias points to the repo root

## rules when editing the dictionary
- keep `e26` unique per row, keep the three columns in every row
- `e23` must never contain `j`, `q` or `v`
- do not guess xh38 spellings: ask the user, or follow existing rows
- keep csv and json (and `public/xnglodiks.json`) in sync

## dev
- `npm install`, `npm run dev`, `npm run build`
- user works from android (termux + github webapp), so prefer small, complete commits pushed directly

## style
- user's chat/ui text is lowercase, in xnglo spelling (e.g. "bek", "sain in", "sain aut")
- plain javascript (jsx), no typescript
