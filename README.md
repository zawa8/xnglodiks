# xnglodiks
dictionary data (`data/xnglodiks.csv`, `data/xnglodiks.json`) with columns:
- e26: normal english
- e23: lowercase english, j->z, q->k, v->w
- xh38: 38 character xnglo hindi

used by the nextjs app (this repo) and the xndroid app.

## setup (auth + quiz)
1. create a free project on supabase.com
2. sql editor: run `supabase/schema.sql`
3. authentication -> email templates -> "magic link"/"confirm signup": put `{{ .Token }}` in the body so the email carries the otp code
4. optional mobile otp: authentication -> providers -> phone, connect an sms provider (twilio etc)
5. vercel -> project settings -> environment variables: the 3 vars from `.env.example`, then redeploy
