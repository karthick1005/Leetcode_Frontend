<div align="center">
  <img src="public/images/Logo.svg" alt="LeetCode Clone Logo" width="80" />
  <h1>LeetCode Clone — Frontend</h1>
  <p>A full-featured, browser-based competitive programming platform built with React, Monaco Editor, and Firebase.</p>

  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black)
  ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Available Scripts](#-available-scripts)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**LeetCode Clone Frontend** is a React single-page application that replicates the core experience of LeetCode — a competitive programming platform. Users can browse algorithmic problems, write and test solutions in a VS Code-quality editor, view real-time execution results, and track their submission history.

The frontend communicates with a dedicated backend API for code compilation and execution, and uses **Firebase Firestore** as the database for problem data and **Firebase Auth** for user authentication.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **Problem List** | Browse all problems with title, difficulty badge, and topic tags |
| 🖊️ **Monaco Code Editor** | VS Code-grade editor with syntax highlighting via TextMate grammars |
| 🌐 **Multi-Language Support** | Java, Python, JavaScript, and C++ |
| ▶️ **Run & Test** | Execute code against custom test cases and see instant results |
| ✅ **Submit Solutions** | Submit solutions and get Accept / Wrong Answer / Runtime Error verdicts |
| 📜 **Submission History** | Review past submissions with code, verdict, and execution metrics |
| 📝 **Submission Notes** | Add personal notes to any previous submission |
| 💾 **Auto-Save via IndexedDB** | Code is automatically saved in the browser — survive page refreshes |
| 🔐 **Firebase Authentication** | Secure login with Firebase Auth |
| 🌓 **Dark Theme** | Full dark-mode interface optimised for long coding sessions |
| 📐 **Dockable IDE Layout** | Drag-and-drop panel layout powered by Flexlayout-react |

---

## 🛠️ Tech Stack

### Frontend Core

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.3 | UI library |
| [Vite](https://vitejs.dev/) | 6.0 | Build tool & dev server (HMR) |
| [React Router DOM](https://reactrouter.com/) | 7.0 | Client-side routing |

### Code Editor & Syntax

| Technology | Version | Purpose |
|---|---|---|
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | 0.52 | VS Code-quality editor engine |
| [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) | 4.6 | React wrapper for Monaco |
| [monaco-textmate](https://github.com/bolinfest/monaco-textmate) | 3.0 | TextMate grammar support |
| [onigasm](https://github.com/nicolo-ribaudo/onigasm) | 2.2 | Oniguruma regex engine (WASM) |
| [CodeMirror](https://codemirror.net/) | 6.0.1 | Lightweight editor for test-case input |

### Styling

| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| [DaisyUI](https://daisyui.com/) | 4.12 | Tailwind component library |
| [Flexlayout-react](https://github.com/caplin/FlexLayout) | 0.8 | Dockable IDE-style panel layout |

### Backend Services & Data

| Technology | Version | Purpose |
|---|---|---|
| [Firebase](https://firebase.google.com/) | 11.1 | Auth (login) & Firestore (problem data / submissions) |
| [Axios](https://axios-http.com/) | 1.7 | HTTP client for backend API calls |
| IndexedDB (native) | — | Browser-side code persistence |

### Dev Tooling

| Technology | Purpose |
|---|---|
| ESLint 9 + React plugins | Static code analysis |
| Prettier 3 | Code formatting |
| PostCSS + Autoprefixer | CSS transformation pipeline |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                        │
│                                                             │
│  React + Vite                                               │
│  ┌────────────┐   ┌──────────────────┐   ┌──────────────┐  │
│  │ ProblemList│   │  Problem Page     │   │  Login Page  │  │
│  │  (Firestore│   │  ┌─────────────┐ │   │  (Firebase   │  │
│  │   queries) │   │  │Monaco Editor│ │   │   Auth)      │  │
│  └────────────┘   │  └─────────────┘ │   └──────────────┘  │
│                   │  ┌─────────────┐ │                      │
│                   │  │ Description │ │                      │
│                   │  └─────────────┘ │                      │
│                   │  ┌─────────────┐ │                      │
│                   │  │ Test Cases  │ │                      │
│                   │  └─────────────┘ │                      │
│                   │  ┌─────────────┐ │                      │
│                   │  │ Submissions │ │                      │
│                   │  └─────────────┘ │                      │
│                   └──────────────────┘                      │
│                         │                                   │
│                    IndexedDB                                │
│                  (local code cache)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (Axios)
                            ▼
              ┌─────────────────────────┐
              │    Backend API Server   │
              │  (Code Compiler /       │
              │   Execution Engine)     │
              └─────────────────────────┘
                            │
              ┌─────────────────────────┐
              │   Firebase / Firestore  │
              │  (Problem Data, Auth,   │
              │   Submissions)          │
              └─────────────────────────┘
```

### Data Flow

1. **Problem List** — Fetched directly from **Firestore** on page load.
2. **Code Execution** — User code is sent to the **backend API** via Axios; results are displayed in the Test Result panel.
3. **Submissions** — Stored in and read from **Firestore**, scoped to the authenticated user.
4. **Code Persistence** — Active editor content is continuously saved to **IndexedDB** so it survives refreshes.

---

## 📁 Project Structure

```
Leetcode_Frontend/
├── public/
│   ├── images/               # Static assets (logo, loader GIF)
│   └── wasm/                 # WebAssembly modules (Onigasm)
├── src/
│   ├── assets/               # SVG icons and React asset files
│   ├── components/
│   │   ├── CodeEditor/       # Monaco Editor wrapper component
│   │   ├── Description/      # Problem description renderer
│   │   ├── Submissions/      # Submission list + notes modal
│   │   │   └── SubmissionDetails/
│   │   ├── TestResult/       # Execution result display
│   │   └── Testcase/         # Test case input (CodeMirror)
│   ├── pages/
│   │   ├── Login/            # Firebase auth login page
│   │   ├── Problem/          # Main problem-solving page (IDE layout)
│   │   └── ProblemList/      # Problem catalogue page
│   ├── routes/
│   │   └── Router.jsx        # React Router route definitions
│   ├── Utils/
│   │   ├── Firebase.js       # Firebase app initialisation
│   │   ├── axios.js          # Axios instance & base URL config
│   │   ├── indexedDB.js      # IndexedDB helpers (read/write code)
│   │   ├── toast.js          # Toast notification helpers
│   │   └── utils.js          # Shared utility functions
│   ├── App.jsx               # Root component (theme + router outlet)
│   ├── App.css               # Global component styles
│   ├── index.css             # Tailwind directives + base styles
│   └── main.jsx              # React DOM entry point
├── index.html                # Vite HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind + DaisyUI configuration
├── postcss.config.js         # PostCSS pipeline
├── eslint.config.js          # ESLint rules
├── vercel.json               # Vercel deployment & rewrite rules
└── package.json              # Project metadata & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (bundled with Node.js)
- A running instance of the **backend compilation API** (default: `http://localhost:9000`)

> **Firebase**: The project uses a pre-configured Firebase project. To use your own Firebase project, update the config in `src/Utils/Firebase.js`.

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/karthick1005/Leetcode_Frontend.git
cd Leetcode_Frontend

# 2. Install dependencies
npm install
```

---

### Environment Variables

The project currently hard-codes the backend API URL and Firebase credentials. For a production setup, it is strongly recommended to extract these into environment variables.

Create a `.env` file in the project root:

```env
# Backend API base URL (code execution / compilation server)
VITE_API_BASE_URL=http://localhost:9000

# Firebase project configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Note**: Vite exposes only variables prefixed with `VITE_` to the client bundle. Never commit `.env` files containing real credentials to version control.

---

### Running the App

```bash
# Start the development server (http://localhost:5173)
npm run dev
```

The app will open at `http://localhost:5173`. Make sure the backend API is also running, otherwise code execution will fail.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `npm run dev` | Start the Vite dev server with Hot Module Replacement |
| **build** | `npm run build` | Compile and bundle the app for production (outputs to `dist/`) |
| **preview** | `npm run preview` | Serve the production build locally to verify before deploying |
| **lint** | `npm run lint` | Run ESLint across all source files |

---

## 🔌 API Integration

The frontend integrates with two external services:

### 1. Backend Compilation API

All code execution requests are proxied through the `/api` path.

| Endpoint | Method | Description |
|---|---|---|
| `/api/run` | `POST` | Run code against provided test cases |
| `/api/submit` | `POST` | Submit solution for full evaluation |

**Local development** — The Axios base URL defaults to `http://localhost:9000` (`src/Utils/axios.js`).

**Production (Vercel)** — The `vercel.json` rewrite rule proxies `/api/*` to the deployed backend:
```json
{ "source": "/api/(.*)", "destination": "http://<backend-host>:9000/$1" }
```

### 2. Firebase / Firestore

| Collection | Description |
|---|---|
| `problems` | Problem catalogue (title, description, difficulty, topics, examples) |
| `submissions` | Per-user submission history |

Authentication is handled by **Firebase Auth** (Email / Password or OAuth providers configured in the Firebase console).

---

## ☁️ Deployment

The application is configured for **Vercel** deployment.

### Deploy to Vercel

```bash
# Using the Vercel CLI
npm install -g vercel
vercel --prod
```

Or connect your GitHub repository directly in the [Vercel Dashboard](https://vercel.com/dashboard) for automatic deployments on every push to `main`.

**Build settings** (auto-detected by Vercel):

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

The `vercel.json` file at the project root configures:
- **API proxy** — routes `/api/*` to the backend server.
- **SPA fallback** — routes all other paths to `index.html` so React Router handles navigation.

---

## 🤝 Contributing

Contributions are welcome! Please follow the steps below:

1. **Fork** the repository.
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch and describe your changes.

### Code Style

- Follow the ESLint rules configured in `eslint.config.js`.
- Format code with **Prettier** before committing (`npx prettier --write .`).
- Keep components small and focused; place shared logic in `src/Utils/`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/karthick1005">karthick1005</a>
</div>
