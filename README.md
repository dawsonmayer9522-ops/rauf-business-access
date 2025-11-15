# Abdul Rauf Business Access Portal

This repository contains a **production‑ready internal web application** built with **Next.js 14** and **TypeScript**.  
It replaces the simple static site at **https://www.raufabdulltd.online/** with a modern dashboard that connects to your Facebook Business and Pages, exercises the required permissions and allows you to subscribe your app to a Page.  
The interface uses a persistent sidebar and top bar (similar to SaaS tools like ChatPion) and guides you through the flow of selecting a business, selecting a page and subscribing to metadata.

## Features

* **Next.js 14 with the App Router** – modern routing and layouts.
* **TypeScript** – type safety across the entire codebase.
* **Tailwind CSS** – fully responsive dashboard layout styled with utility classes and subtle shadows.
* **Server‑side API routes** – all calls to the Facebook Graph API are proxied through Next.js API routes.  
  The frontend never communicates directly with Facebook and the user access token is stored securely in an HttpOnly cookie.
* **OAuth login flow** – `/api/auth/facebook/login` redirects the user to the Facebook OAuth dialog and `/api/auth/facebook/callback` exchanges the `code` for a user access token.
* **Full permission demonstration** – users select a business, pick a page, view page details and subscribe the app to that page, exercising the `business_management`, `pages_show_list` and `pages_manage_metadata` permissions.

## Directory structure

```
raufabdulltd-app/
├── app/                         # Next.js app router directory
│   ├── (dashboard)/             # Pages using the shared dashboard layout
│   │   ├── layout.tsx           # Dashboard layout wrapper (sidebar + top bar)
│   │   ├── page.tsx             # Home page
│   │   ├── select-business/     # Business selection page
│   │   ├── select-page/         # Page selection page
│   │   ├── page-settings/       # Page settings and subscription
│   │   └── done/                # Summary screen
│   ├── api/                     # Serverless API routes
│   │   ├── auth/facebook/login/route.ts
│   │   ├── auth/facebook/callback/route.ts
│   │   ├── me/businesses/route.ts
│   │   ├── business/[business_id]/pages/route.ts
│   │   ├── page/[page_id]/details/route.ts
│   │   ├── page/[page_id]/subscription-status/route.ts
│   │   └── page/[page_id]/subscribe/route.ts
│   ├── globals.css              # Global Tailwind styles
│   └── layout.tsx               # Root layout importing fonts and global styles
├── components/                  # Shared UI components (Sidebar, Topbar, Layout)
├── lib/                         # (optional) utility functions
├── .env.local.example           # Sample environment variable file
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # NPM scripts and dependencies
└── README.md
```

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Facebook app credentials:

```bash
cp .env.local.example .env.local
```

| Variable        | Description                                                                                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `FB_APP_ID`     | Your Facebook App ID.                                                                                                                             |
| `FB_APP_SECRET` | Your Facebook App secret.                                                                                                                         |
| `FB_REDIRECT_URI` | The redirect URI registered in your Facebook App settings. It should match `https://www.raufabdulltd.online/api/auth/facebook/callback` in production. |
| `FB_API_VERSION` | Facebook Graph API version to use (e.g. `v21.0`).                                                                                                |


## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file based off of `.env.local.example` and add your Facebook credentials.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.


## Deploying to Vercel

1. Create a new project on [Vercel](https://vercel.com/) and import this repository.
2. In the Vercel project settings, add the environment variables defined in `.env.local.example` (`FB_APP_ID`, `FB_APP_SECRET`, `FB_REDIRECT_URI`, `FB_API_VERSION`).  
   For `FB_REDIRECT_URI` use `https://www.raufabdulltd.online/api/auth/facebook/callback`.
3. Deploy the project. Vercel will handle building and hosting the Next.js app.
4. Once deployed, navigate to `https://www.raufabdulltd.online` to use the tool.  
   If you mapped a custom domain, ensure it points to your Vercel deployment and update `FB_REDIRECT_URI` accordingly.


## Notes

* This tool is **internal** and intended to be used only by you (the Facebook App owner) during the Meta App Review process. It is not a public multi‑tenant SaaS.
* The Facebook user access token is stored in a signed, HttpOnly cookie (`fb_user_token`) and never sent to the client directly. All Graph API calls are made via the server‑side API routes.
* If a user is not authenticated (missing or expired token), API routes return a 401 and the frontend automatically redirects back to the home page.
* The UI uses a modern dashboard shell with a persistent sidebar and top bar. Step call‑outs and breadcrumbs help guide you through selecting a business, selecting a page and subscribing to page metadata.
* Feel free to adjust colours and fonts in `tailwind.config.js` and `app/globals.css` to more closely match your brand.