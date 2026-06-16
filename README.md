# InsightDesk — Frontend Client

> Production-grade React/TypeScript frontend for the InsightDesk AI productivity workspace.

🌐 **Live App:** [Vercel](https://insightdesk-frontend-xi.vercel.app) 
**Backend Repo:** [InsightDesk Backend](https://github.com/Mukul-2000/insightdesk-backend)

---

## 🚀 Overview

InsightDesk Frontend is a modern React + TypeScript single-page application delivering a fluid AI productivity workspace. It features Google OAuth 2.0 authentication, an AWS S3 document pipeline UI, a multi-turn persistent AI chat interface, and a real-time Content Studio powered by Socket.IO live status updates.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS (rounded-3xl fluid design system) |
| Routing | React Router DOM (Layout Guarding) |
| Real-Time | Socket.IO Client |
| Auth | Google OAuth 2.0 + JWT |
| HTTP Client | Axios |
| State Management | React Context + useState/useReducer |
| DevOps | Git (main/dev branching) + Vercel Auto-Deploy |

---

## 🏗️ Architecture

```
React App
    │
    ├── Layout Guard (React Router)
    │       ├── Public Routes  → /login
    │       └── Protected Routes → /dashboard, /chat, /studio
    │
    ├── Auth Layer
    │       └── Google OAuth 2.0 → JWT stored in localStorage
    │
    ├── Socket.IO Client
    │       └── Real-time agent status updates from backend
    │
    ├── HTTP Layer (Axios)
    │       ├── Document upload → AWS S3 pipeline
    │       ├── Chat messages → MongoDB persistent history
    │       └── Content Studio → AI fleet processing
    │
    └── UI Components
            ├── Chat Interface (multi-turn persistent)
            ├── Document Manager (S3 upload/list/delete)
            └── Content Studio (real-time stepper UI)
```

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Chat/           # Multi-turn chat interface
│   │   ├── Documents/      # S3 document manager
│   │   ├── Studio/         # Content studio stepper
│   │   └── Common/         # Shared UI elements
│   ├── context/            # React Context (Auth, Socket)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route level page components
│   │   ├── Login.tsx       # Google OAuth login
│   │   ├── Dashboard.tsx   # Main workspace
│   │   ├── Chat.tsx        # AI chat interface
│   │   └── Studio.tsx      # Content studio
│   ├── routes/             # React Router config + guards
│   ├── services/           # Axios API service layer
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/
├── .env.example
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔐 Authentication Flow

```
User visits app
      ↓
Layout Guard checks JWT in localStorage
      ↓
No JWT → Redirect to /login
      ↓
User clicks "Login with Google"
      ↓
Redirected to Google OAuth consent screen
      ↓
Backend receives callback + returns JWT
      ↓
JWT stored in localStorage
      ↓
User redirected to /dashboard
      ↓
All API requests include JWT in Authorization header
```

---

## 🔌 Real-Time Socket.IO Integration

```javascript
// Socket connection established on login
const socket = io(BACKEND_URL, {
  auth: { token: localStorage.getItem('token') }
})

// Listen for real-time AI agent status updates
socket.on('agent:status', ({ step, status, message }) => {
  // Update stepper UI in real-time
  updateStepperState(step, status, message)
})

// Listen for chat responses
socket.on('chat:response', ({ message, timestamp }) => {
  // Append to chat history
  appendMessage({ role: 'assistant', message, timestamp })
})
```

---

## 🎨 Design System

- **Border Radius:** `rounded-3xl` fluid cards throughout
- **Color Palette:** Dark workspace theme with accent highlights
- **Typography:** Clean sans-serif hierarchy
- **Layout:** Responsive grid — works on desktop and mobile
- **Animations:** Smooth transitions on stepper and chat updates

---

## 📱 Key Features

### 1. Google OAuth Login
- One-click federated authentication
- No password storage
- JWT session management

### 2. Document Manager
- Upload documents to AWS S3
- List and preview uploaded documents
- Delete documents from S3 + database
- Supports PDF, DOCX, TXT formats

### 3. Multi-Turn AI Chat
- Persistent chat history across sessions (MongoDB)
- Context-aware multi-turn conversations
- Real-time streaming responses via WebSocket

### 4. Content Studio
- Upload media files (audio, video, documents)
- Real-time stepper UI showing AI processing stages
- Cross-vendor AI fleet processing:
  - 🎙️ Audio transcription via Groq Whisper
  - ✍️ Content generation via Llama 3.3 70B
  - 🔍 Quality audit via Gemini 2.5 Flash
- Download processed results

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- InsightDesk Backend running

### Installation

```bash
# Clone the repository
git clone https://github.com/Mukul-2000/insightdesk-frontend

# Install dependencies
cd frontend
npm install

# Setup environment variables
cp .env.example .env
# Fill in your credentials

# Run in development
npm run dev

# Build for production
npm run build
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔄 CI/CD Pipeline

```
Developer pushes to dev branch
        ↓
Local testing + build verification
        ↓
PR merged into main
        ↓
Vercel auto-detects main branch push
        ↓
Builds React + TypeScript
        ↓
Deploys to Vercel edge network
        ↓
Live at production URL instantly
```

---

## 📂 Route Structure

```
/                   → Redirect to /login or /dashboard
/login              → Google OAuth login page (public)
/dashboard          → Main workspace (protected)
/chat               → AI chat interface (protected)
/studio             → Content studio (protected)
```

### Layout Guard Implementation
```typescript
// Protects all authenticated routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}
```

---

## 🛡️ Security

- JWT stored and sent with every API request
- Protected routes via Layout Guard
- Google OAuth — no credentials handled by app
- Environment variables for all sensitive config
- HTTPS enforced on Vercel production

---

## 👨‍💻 Author

**Mukul Sindhu** — Full Stack Developer
- Portfolio: [mukulsindhu.netlify.app](https://mukulsindhu.netlify.app)
- GitHub: [github.com/Mukul-2000](https://github.com/Mukul-2000)
- Email: imukulsindhu@gmail.com
