# 🌍 CrisisMapper AI

> AI-assisted Community Emergency Mapping Platform for Real-Time Disaster Reporting, Verification & Volunteer Coordination.

---

## 📌 Overview

CrisisMapper AI is a crowdsourced emergency response platform that enables people to report incidents, verify emergencies using geolocation, discover nearby volunteers, visualize disaster hotspots, and coordinate community response in real time.

The platform combines **real-time mapping**, **community verification**, **AI-assisted reporting**, and **location intelligence** to improve disaster awareness and response.

---

# ✨ Features

## 📍 Interactive Live Map

- Click anywhere to drop an incident
- Automatic user location detection
- Fly-to animation for shared incidents
- Real-time updates using Firebase

---

## 🤖 AI Incident Reporting

Instead of manually filling the form, users can simply describe their situation in natural language.

Example:

> "There is a fire near Agra Cantt."

The AI automatically:

- Understands the emergency
- Detects severity
- Selects the correct category
- Opens the report form with pre-filled details
- Places the incident on the map

This makes reporting much faster during emergencies.

---

## 🚨 Emergency Reporting

Supported incident categories:

- 🚑 Medical
- 🔥 Fire
- 🚗 Accident
- 🌊 Flood
- 🚓 Crime
- ⚡ Infrastructure Damage
- 👤 Missing Person
- ❓ Other

Each report stores:

- Category
- Severity
- Notes
- GPS Location
- Timestamp
- Optional Reporter Name

---

## ❤️ Offer Help

Users can also register themselves as available helpers.

Examples:

- Doctor
- Ambulance
- NGO
- Rescue Team
- Food Distribution
- Volunteer

These helpers appear separately from emergency requests.

---

## 👍 Community Support

Anyone can support an incident by clicking **👍 Support**.

Support:

- increases community confidence
- contributes to Verification Score
- is limited to one vote per user/browser

---

## ✅ Geo-Verified Witness Confirmation

Unlike a normal support vote, verification requires the user to be physically close to the reported incident.

Features:

- Browser GPS verification
- Distance calculation
- Configurable verification radius
- Prevents fake confirmations
- One verification per authenticated user

---

## 📈 Verification Score

Every incident receives a dynamic trust score.

Calculated using:

- Community Support
- Verified Witnesses

Displayed as:

- Percentage
- Progress Bar
- Color Indicator

---

## 🆘 SOS Emergency Button

In situations where users cannot type, a single tap on **SOS** instantly creates:

- Medical Emergency
- Critical Severity
- Current GPS Location

No form filling required.

---

## 🤝 Nearby Helpers

Every emergency popup automatically displays nearby volunteers.

Sorted by:

- Distance

Examples:

- Doctors
- Ambulances
- NGOs
- Volunteers

Helping victims quickly identify available assistance.

---

## 🔥 AI Hotspot Detection

Nearby emergency reports are automatically clustered into hotspots.

Each hotspot displays:

- Number of nearby incidents
- Hotspot Score
- Circle overlay on map

Only active emergency requests contribute.

Volunteer locations are intentionally excluded.

---

## 🌡 Heatmap Mode

Toggle between:

- 📍 Pin View
- 🔥 Heatmap View

to visualize areas with high emergency density.

---

## 📊 Live Statistics Dashboard

Displays:

- Active Incidents
- Resolved Today
- Available Helpers
- Category Distribution

Updates instantly from Firestore.

---

## 🔗 Shareable Incident Links

Every report generates a unique URL.

Opening the link:

- focuses the map
- flies directly to the incident
- automatically opens its popup

---

## ✔ Mark Resolved

Incident owners can mark emergencies as resolved.

Resolved incidents:

- change color
- leave hotspot calculations
- remain visible until expiry

---

## ⏰ Automatic Pin Expiry

Old incidents automatically expire after the configured duration to keep the map clean.

---

## 🔄 Real-Time Synchronization

Using Firestore realtime listeners:

- Live pins
- Live verification
- Live support count
- Live helper updates
- Live hotspot updates

No page refresh required.

---

## 🔒 Anonymous Authentication

Firebase Anonymous Authentication provides:

- Unique user identity
- Prevents duplicate verification
- Prevents duplicate support votes

without requiring account creation.

---

## 📱 Responsive UI

Fully responsive across:

- Desktop
- Tablet
- Mobile

---

## 🗺 Map Legend

Built-in legend explains:

- Severity Colors
- Hotspots
- Resolved Reports
- Nearby Helpers

---

# 🛠 Tech Stack

Frontend

- React
- Vite
- Tailwind CSS
- React Leaflet
- Leaflet Heat
- Lucide Icons

Backend

- Firebase Firestore
- Firebase Anonymous Authentication

AI

- Google Gemini API

Maps

- OpenStreetMap
- Leaflet

---

# 📂 Project Structure

```
src/
│
├── components/
│   ├── Map.jsx
│   ├── PinForm.jsx
│   ├── PinPopup.jsx
│   ├── ChatWidget.jsx
│   ├── StatsBar.jsx
│   └── ...
│
├── hooks/
│   ├── usePins.js
│   ├── useGeolocation.js
│   └── useHotspots.js
│
├── lib/
│   ├── firebase.js
│   ├── auth.js
│   └── constants.js
│
└── App.jsx
```

---

# 🚀 Getting Started

## 1 Clone Repository

```bash
git clone https://github.com/yourusername/CrisisMapper.git

cd CrisisMapper
```

---

## 2 Install Dependencies

```bash
npm install
```

---

## 3 Create Environment File

Create

```
.env
```

Add your Firebase and Gemini credentials.

```env
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_GEMINI_API_KEY=
```

---

## 4 Enable Firebase

Create a Firebase project.

Enable:

- Firestore Database
- Anonymous Authentication

Copy your configuration into the `.env` file.

---

## 5 Install Firestore Rules

Use appropriate Firestore rules for your project (development or production).

---

## 6 Start Development Server

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

# 🧠 How AI Reporting Works

1. User types a message.

Example:

```
There is a building on fire near Agra Cantt.
```

↓

Gemini analyzes the message.

↓

Extracts:

- Category
- Severity
- Description

↓

Automatically opens the report form.

↓

User only confirms the location.

↓

Incident is submitted to Firestore.

---

# 🔥 Demo Scenario

Recommended demo flow:

1. Open application
2. Show live statistics
3. Toggle Heatmap
4. Display hotspot circles
5. Report a new emergency
6. Use AI chat to create another report
7. Trigger SOS
8. Support an incident
9. Geo-verify the incident
10. Show nearby helpers
11. Share incident link
12. Mark incident resolved
13. Show real-time synchronization in another browser tab

---

# 🌱 Future Improvements

- AI Image Verification
- Offline Reporting
- SMS Alerts
- Government Dashboard
- Rescue Route Optimization
- Predictive Disaster Analytics
- Drone Integration
- Push Notifications

---

# 👨‍💻 Author

Developed for hackathon submission.

Built with ❤️ using React, Firebase, Leaflet and Gemini AI.