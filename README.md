# LIVE DEMO URL
https://insightdesk-frontend-xi.vercel.app

# InsightDesk Frontend Client 💻

A high-performance, modern single-page application dashboard built with **React**, **Vite**, and **TypeScript**. Styled entirely using the **Tailwind CSS v4** native CSS-first engine, this application delivers a responsive user interface featuring secure routing, dynamic markdown conversation rendering, and fluid document upload interactions.

## ✨ Core Features

* **Contextual Auth State Management:** Features a centralized React `AuthContext` provider that manages active user tokens, forces session persistence via `localStorage`, and shields internal dashboard routes.
* **Semantic Rich-Text Rendering:** Leverages `react-markdown` and `remark-gfm` to format Gemini responses (bullet points, bold text structures, tabular code modules) beautifully.
* **RAG Evidence Attributions:** Automatically processes and renders native file attachment tags underneath model chat responses to highlight the exact sources used in building answers.
* **Zero-Boilerplate Tailwind CSS v4 Build:** Leverages the high-speed `@tailwindcss/vite` native compiler architecture, eliminating legacy configurations like `tailwind.config.js` or `postcss.config.js`.
* **Optimistic UI Updates:** Updates chat arrays instantly on submission and switches layout states gracefully with animated loading indicators during heavy extraction phases.

## 🛠️ Tech Stack

* **Build Tool & Engine:** Vite + React 18 with TypeScript strict checking
* **Styling Framework:** Tailwind CSS v4
* **Icon Library:** Lucide React
* **Markdown Core:** `react-markdown` + `remark-gfm`

## 📂 Folder Structure

```text
src/
├── components/      # Functional UI Elements (ChatWindow, AuthScreen)
├── context/         # React Context Global State Providers (AuthContext)
├── services/        # Decoupled API Networking Layer (api.ts, auth.ts)
├── types/           # Static TypeScript Core Models & Interfaces
├── App.tsx          # Master Layout Router and Route Guard Guardrail
└── main.tsx         # Virtual DOM Entry Mount Point
⚙️ Setup & Installation
Clone the repository and install dependencies:

Bash
git clone <your-frontend-repo-url>
cd insightdesk-frontend
npm install
Configure Environment Variables:
Create a .env file in the root directory:

Code snippet
VITE_API_BASE_URL=http://localhost:5000/api
Launch the Vite Hot-Reloading Development Server:

Bash
npm run dev
Compile Production Distribution Build:

Bash
npm run build