# CrisisMapper

**Real-time community crisis coordination. No signup. No app. Just help.**

CrisisMapper is a full-stack disaster relief coordination web app that lets anyone — without logging in — report a crisis or offer help on an interactive map. During disasters, information is scattered and help is hard to coordinate. CrisisMapper solves this by giving communities a shared, live map where needs and offers of help appear instantly for everyone.

![CrisisMapper live map](./public/screenshot.png)

> Add a screenshot of your deployed map at `public/screenshot.png` after deploying.

## Two Ways to Drop a Pin

### 1. Manual — Click the Map
Click anywhere on the map to open the pin form with coordinates pre-filled. Choose a category, severity, and add a short note.

### 2. CrisisAI — Describe Your Situation
Open the floating chat widget (bottom-right) and describe your situation in plain English. Google Gemini extracts location, category, severity, and auto-fills the same pin form for you to review and submit.

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Map | Leaflet.js + OpenStreetMap |
| Real-time Database | Firebase Firestore |
| AI Feature | Google Gemini API (`gemini-1.5-flash`) |
| Hosting | Vercel |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |

## Run Locally

```bash
npm install
cp .env.example .env
# Fill in your Firebase and Gemini keys in .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GEMINI_API_KEY` | Google Gemini API key |

Never commit your `.env` file. Use `.env.example` as a template.

## Firebase Setup

1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Enable **Cloud Firestore** in test mode (or configure rules for public read/write on `pins`)
3. Copy your web app config into `.env`

Example Firestore rules for development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pins/{pinId} {
      allow read, write: if true;
    }
  }
}
```

## Live Demo

Deploy to Vercel and add your link here:

**[Your Vercel demo link](#)**

## Features

- Interactive map centered on your geolocation
- Color-coded markers by category, sized by severity
- Critical pins with pulsing animation
- Pin view and heatmap view toggle
- Category and type filters with live counts
- Real-time stats bar (active crises, resolved today, helpers)
- 24-hour pin auto-expiry
- Mark as resolved, upvote, and shareable pin URLs (`/pin/:id`)
- CrisisAI chat widget powered by Gemini
- Mobile responsive with reduced-motion support

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

## License

MIT
