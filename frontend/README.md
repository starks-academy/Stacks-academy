
## 🌐 What is Stacks Academy?

Stacks Academy is an **interactive, structured learning platform** designed to take complete beginners all the way to confident Bitcoin L2 developers — through guided lessons, hands-on coding, AI mentorship, and real project building.

Whether you've never heard of Stacks or you're ready to deploy your first Clarity smart contract, Stacks Academy meets you where you are and gets you where you want to go.

---

## ✨ Platform Features

### 🎓 Structured Learning Paths

A carefully sequenced curriculum that builds knowledge progressively — no prior blockchain experience required.

| Module | Topics Covered | Level |
|--------|---------------|-------|
| **1. Stacks Fundamentals** | What is Bitcoin L2? How Stacks works, Proof of Transfer (PoX), STX token, wallets & transactions | Beginner |
| **2. Clarity Smart Contracts** | Clarity language basics, data types, functions, maps, error handling, testing | Intermediate |
| **3. sBTC & DeFi** | sBTC bridge mechanics, DeFi protocols on Stacks, liquidity, yield strategies | Advanced |
| **4. Capstone Project** | Build and deploy a full dApp from scratch with AI guidance and peer review | Expert |

Each module contains:
- Bite-sized lessons with visual explainers
- Interactive quizzes after each section
- Coding challenges with instant feedback
- Real-world case studies from live Stacks projects

---

### 🤖 AI Tutor (Powered by Claude)

Your always-available personal mentor. The AI tutor can:

- **Explain any concept** in plain English — ask "What is Proof of Transfer?" and get a clear, friendly answer
- **Debug your Clarity code** — paste your contract and get line-by-line feedback
- **Quiz you adaptively** — generates custom questions based on your weak spots
- **Suggest what to learn next** — tracks your progress and recommends the right next step
- **Answer follow-up questions** in a conversational back-and-forth style

> The AI tutor is context-aware — it knows which lesson you're on and what you've already completed.

---

### 🛝 In-Browser Clarity Playground

Write, test, and deploy Clarity contracts without installing anything.

**Features:**
- Full Clarity syntax highlighting and autocomplete
- Live error detection as you type
- Built-in contract templates (fungible tokens, NFTs, DAOs, vaults)
- One-click deploy to **Stacks testnet**
- Transaction inspector to see on-chain results in real time
- Share your contract via a permalink

> Think of it as a Clarity REPL + IDE right in your browser — no setup, no friction.

---

### 📝 AI-Graded Assessments

Go beyond multiple choice. Our assessments include:

- **Code challenges** where you write real Clarity functions
- **Open-ended questions** graded by AI for conceptual accuracy
- **Scenario-based problems** that test practical judgment
- **Instant detailed feedback** explaining why your answer was right or wrong

Assessments adapt to your level — if you're excelling, the difficulty increases automatically.

---

### 🏅 NFT Certificates (SIP-009)

Earn verifiable, on-chain proof of your skills.

- Certificates are minted as **SIP-009 NFTs** on the Stacks blockchain
- Each certificate encodes your name, completed module, score, and timestamp
- Permanently verifiable — no central authority can revoke or fake them
- Shareable on LinkedIn, Twitter/X, or any portfolio
- Unlocked upon passing each module's final assessment

---

### 🏗️ Builder Gallery

See what the community is building.

- Browse projects deployed by Stacks Academy graduates
- Filter by category: DeFi, NFTs, DAOs, utilities
- Leave feedback and upvote your favorites
- Submit your own capstone project for community review
- Featured projects earn bonus XP and platform recognition

---

### 🎮 XP, Levels & Gamification

Learning should be rewarding.

- Earn **XP** for completing lessons, passing quizzes, and helping others
- Level up from **Stacker Novice → Clarity Coder → Bitcoin Builder → L2 Architect**
- Daily streaks reward consistent learning
- Leaderboard rankings for competitive learners
- Achievement badges for milestones (first contract deployed, first NFT minted, etc.)

---

## 🗂️ Repository Structure

```
stacks-academy/
├── README.md                  # This file
├── package.json               # npm workspaces definition
├── .gitignore
│
├── frontend/                  # React/Next.js UI
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # Reusable UI components
│   └── styles/                # Tailwind CSS config
│
├── ai-tutor/                  # Node.js backend for AI tutor
│   ├── routes/                # API endpoints
│   ├── prompts/               # System prompts & context builders
│   └── services/              # Claude API integration
│
├── clarity-playground/        # In-browser Clarity editor
│   ├── editor/                # Monaco-based editor config
│   ├── runtime/               # Clarity interpreter bridge
│   └── templates/             # Starter contract templates
│
├── nft-service/               # NFT certificate service
│   ├── contracts/             # SIP-009 Clarity contracts
│   ├── minting/               # Certificate generation & minting
│   └── metadata/              # On-chain metadata schemas
│
└── gallery/                   # Builder leaderboard & showcase
    ├── api/                   # Project submission & voting API
    ├── components/            # Gallery UI components
    └── moderation/            # Community review tooling
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm v9+
- A Stacks-compatible wallet (e.g. [Leather](https://leather.io) or [Xverse](https://xverse.app))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/stacks-academy
cd stacks-academy

# Install all workspace dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Add your Anthropic API key and Stacks API keys to .env
```

### Running Locally

```bash
# Start the frontend (Next.js dev server)
cd frontend && npm run dev
# → http://localhost:3000

# Start the AI tutor backend
cd ai-tutor && npm run dev
# → http://localhost:4000

# Start the Clarity playground server
cd clarity-playground && npm run dev
# → http://localhost:5000
```

### Running All Services at Once

```bash
# From the root — runs all packages in parallel
npm run dev
```

---

## 🧭 Learning Journey at a Glance

```
[ Sign Up ] → [ Take Placement Quiz ] → [ Start Module 1 ]
                                               ↓
                                    [ Lessons + AI Tutor ]
                                               ↓
                                    [ Playground Practice ]
                                               ↓
                                    [ AI-Graded Assessment ]
                                               ↓
                                    [ Earn NFT Certificate ]
                                               ↓
                              [ Level Up + Advance to Next Module ]
                                               ↓
                                    [ Capstone Project ]
                                               ↓
                              [ Submit to Builder Gallery 🎉 ]
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| AI Tutor | Claude (Anthropic), Node.js |
| Smart Contracts | Clarity (Stacks blockchain) |
| Code Editor | Monaco Editor (VS Code engine) |
| Blockchain | Stacks L2, Bitcoin settlement |
| Auth | Stacks wallet connect (SIP-018) |
| NFTs | SIP-009 standard |
| Database | PostgreSQL + Prisma |

---
