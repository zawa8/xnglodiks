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
