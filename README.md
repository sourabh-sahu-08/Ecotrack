<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EcoTrack — Environmental Clearance Portal

EcoTrack (PARIVESH 3.0) is a next-generation environmental clearance platform designed for the Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India. It leverages Gemini AI to offer intelligent risk analysis, automated report summaries, and transparent public monitoring.

## 🚀 Features

- **AI Risk Scoring**: Automatic environmental risk assessment for projects based on topography, pollution metrics, and forest impact.
- **Satellite Comparison**: Interactive "Before vs After" satellite imagery tracking to monitor land-use changes and deforestation (e.g., Western Ghats Highway Project).
- **AI Permit Advisor**: Intelligent guidance for applicants on required environmental, forest, and wildlife clearances.
- **Meeting Gist**: AI-generated summaries of environmental review meetings.
- **Public Transparency**: Dedicated dashboard for citizens to view projects, submit comments, and verify environmental complaints via AI.
- **Real-time IoT/GIS**: Mock integration for sensor data and satellite-based change detection.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Motion (Framer), Lucide Icons.
- **Backend**: Node.js, Express, Better-SQLite3, JWT Authentication.
- **AI Engine**: Google Gemini (Flash 1.5).

## 💻 Local Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/sourabh-sahu-08/Ecotrack.git
   cd Ecotrack
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_secure_jwt_secret
   ```
4. **Run the App**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Render)

This project is configured for a **Single Web Service** deployment on Render:

- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm start`
- **Port**: Automatic (via `PORT` env var)

### Required Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API Key
- `JWT_SECRET`: A secure string for JWT tokens
- `NODE_ENV`: `production`

---
*© 2026 EcoTrack · Developed for Environmental Efficiency.*
