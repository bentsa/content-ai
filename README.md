
# ContentAI — Full Stack App

> React + Vite + Tailwind + Supabase + Claude API + Unsplash

## Tech Stack

| Layer        | Tool                        |
|--------------|-----------------------------|
| Frontend     | React 18 + Vite             |
| Styling      | Tailwind CSS                |
| Auth + DB    | Supabase                    |
| AI Text      | Anthropic Claude API        |
| Images       | Unsplash API                |
| Routing      | React Router v6             |
| Deployment   | Vercel (recommended)        |



## Project Structure

```
contentai/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Layout.jsx          # Sidebar + outlet wrapper
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state
│   ├── hooks/
│   │   └── useHistory.js           # Supabase history CRUD
│   ├── lib/
│   │   ├── supabase.js             # Supabase client
│   │   ├── anthropic.js            # Claude API helper
│   │   └── unsplash.js             # Unsplash API helper
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TextGenerator.jsx
│   │   ├── ImageGenerator.jsx
│   │   └── History.jsx
│   ├── App.jsx                     # Router + auth guards
│   ├── main.jsx
│   └── index.css                   # Tailwind + design tokens
├── supabase_setup.sql              # Run this in Supabase
├── .env.example                    # Copy to .env
└── vite.config.js
```


## Setup (Step by Step)

### 1. Install dependencies

```bash
cd contentai
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free project
2. Go to **SQL Editor** → paste and run `supabase_setup.sql`
3. Go to **Project Settings → API** → copy your **URL** and **anon key**
4. In **Authentication → Email**, enable email confirmations (or disable for dev)

### 3. Get your API keys

| Service    | Where to get it                              | Free tier |
|------------|----------------------------------------------|-----------|
| Supabase   | Project Settings → API                       | ✅ Yes    |
| Anthropic  | [console.anthropic.com](https://console.anthropic.com) | ✅ $5 credit |
| Unsplash   | [unsplash.com/developers](https://unsplash.com/developers) → New App | ✅ 50 req/hr |

### 4. Create your .env file

```bash
cp .env.example .env
```

Fill in your keys:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)



## Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add your env vars in Vercel dashboard → Settings → Environment Variables
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploy on every push.



## Features

- ✅ Email/password auth with Supabase
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ AI text generation with Claude (blog posts, emails, essays, etc.)
- ✅ Image search powered by Unsplash + Claude query refinement
- ✅ Full history with Supabase (per-user, RLS secured)
- ✅ Dashboard with stats
- ✅ Dark theme with custom design system



## Extending the App

| Feature                  | How to add                                      |
|--------------------------|-------------------------------------------------|
| Real AI image generation | Integrate DALL-E 3 or Stability AI API          |
| Social post generator    | Add new page, reuse `generateText()` helper     |
| Stripe payments          | Add `stripe` package + Supabase edge function   |
| User profile page        | Use `supabase.auth.updateUser()` for profile    |
| Export to PDF            | Add `jspdf` package                             |

# content-ai

