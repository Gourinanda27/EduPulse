# EduPulse — Interactive Educational Publishing Platform 🎓✨

**EduPulse** is an educational publishing platform and learning ecosystem built for writing, publishing, and studying scientific and technical topics. It blends deep article publishing with interactive pedagogy: live in-article quizzes, mathematical formula rendering, interactive code execution sandboxes, audio read-aloud narration, and study flashcards.

---

## 🌟 Key Features

### 1. ✍️ Author Studio & Educational Publishing Engine
- **Rich Content Authoring**: Publish peer-reviewed style lessons with Markdown, formatted mathematics ($$...$$), and structured pedagogical callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`).
- **Comprehension Quiz Builder**: Authors can attach interactive multiple-choice questions with answer keys and conceptual explanations.
- **Side-by-Side Live Preview**: Instant preview mode before publishing.
- **Local Persistence & Portability**: Published posts are immediately active and searchable in the feed. Export and import entire lesson libraries as JSON backups with one click.

### 2. 📖 Immersive Educational Reader
- **Dynamic Reading Progress**: Visual top progress bar tracking reader completion.
- **Audio Narration (Text-to-Speech)**: Integrated browser Speech Synthesis allowing learners to listen to lessons at variable speeds.
- **Interactive Code Blocks**: One-click code copying and direct "Run in Sandbox" bridge.
- **In-Article Knowledge Checks**: Real-time multiple-choice quizzes with instant grading, explanations, and celebratory particle animations.
- **3D Study Flashcards**: Flip cards for rapid recall of key definitions and mathematical theorems.
- **Table of Contents**: Anchor jump links for effortless navigation across long-form deep dives.
- **Community Discussion**: Interactive comments section allowing learners to ask questions, share insights, and like responses.

### 3. 🧪 Interactive Simulation Lab (Code Sandbox)
- Live interactive HTML/CSS/JavaScript runtime playground with sandboxed iframe execution.
- Pre-loaded interactive educational simulations:
  - **Self-Attention Softmax Heatmap**: Visualizes query-key dot products and token affinity matrices.
  - **Euler's Complex Plane Unit Circle**: Real-time trigonometric vector rotation proving $e^{i\theta} = \cos\theta + i\sin\theta$.
  - **Binary Search Step-by-Step Visualizer**: Interactive logarithmic search space halving.

### 4. 🎯 Quiz Hub & Assessment Center
- Cross-curriculum quiz aggregator compiling questions from all published posts.
- Filter by subject track (Computer Science, Artificial Intelligence, Mathematics, Physics, Web Development, Biology).
- Score tracking and celebratory graduation milestones.

### 5. 🎨 Design & Accessibility
- **Dark & Light Modes**: System-aware and persistent theme toggle.
- **Responsive Typography**: Clean fonts (Outfit, Inter, Fira Code) with A- / A / A+ font size scaling.
- **Filter & Search**: Real-time fuzzy search across titles, abstracts, tags, authors, and subjects.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# Navigate to the project directory
cd D:\edupulse

# Install dependencies (already installed)
npm install

# Start the Vite development server
npm run dev

# Open in your browser
http://localhost:5173/
```

### Production Build
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

---

## 📁 Project Architecture

```
edupulse/
├── public/                 # Static assets & favicons
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Navigation, search bar, theme toggle, publish trigger
│   │   ├── Hero.tsx           # Featured deep-dive spotlight, category ribbon, filters
│   │   ├── PostCard.tsx       # Responsive post preview card with metadata & actions
│   │   ├── PostReader.tsx     # Full article reader with TTS, quizzes, flashcards, comments
│   │   ├── PostPublisher.tsx  # Author studio with markdown toolbar & quiz builder
│   │   ├── QuizHub.tsx        # Assessment center aggregating all lesson quizzes
│   │   ├── CodeSandbox.tsx    # Live simulation playground with interactive presets
│   │   ├── BookmarksView.tsx  # Saved reading list manager
│   │   ├── Footer.tsx         # Subject directory and platform manifest
│   │   └── Toast.tsx          # Non-intrusive alert notification system
│   ├── data/
│   │   ├── initialPosts.ts    # Curated lessons across AI, CS, Math, Physics, Bio
│   │   └── initialComments.ts # Vibrant initial peer discussions
│   ├── types/
│   │   └── index.ts           # Strict TypeScript contracts for posts, quizzes, authors
│   ├── App.tsx                # Central state orchestration and router
│   ├── main.tsx               # React 19 root bootstrap
│   ├── style.css              # Custom themes, glassmorphism, 3D cards, responsive layout
│   └── vite-env.d.ts          # Vite client and module typings
├── index.html                 # HTML shell with Google Fonts & metadata
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript compilation rules
└── vite.config.ts             # Vite configuration with React plugin
```

---

## 📜 License
Published under the MIT Open Source License. Built for educators, researchers, and lifelong learners.
