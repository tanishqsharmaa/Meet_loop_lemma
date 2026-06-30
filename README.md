# ♾️ MeetLoop

**An AI Meeting-to-Execution Operator built on the Lemma SDK.**  
*Official Submission for the Gappy AI Hackathon (June 2026) — Problem Statement #4*

## 💡 The Problem
In fast-moving startups, meeting transcripts are a graveyard of context. Action items are lost, cross-functional dependencies are forgotten, and low-confidence decisions slip through the cracks. MeetLoop solves this by autonomously turning raw meeting transcripts into structured, tracked, and executable workflows.

## 🚀 What it does
MeetLoop is an autonomous operator powered by a 5-agent **Lemma Pod**:
1. **Ingests Transcripts:** Automatically parses meeting transcripts via Slack (or Telegram).
2. **Extracts Actions & Decisions:** Pulls out tasks, assigns owners, and logs strategic decisions with rationale.
3. **Calculates CCS & Blockers:** Every extracted action item is scored with a **Commitment Confidence Score (CCS)** (0-100). If an item is vague (CCS < 50), it is gated for human review. It also automatically detects cross-task dependencies.
4. **Notifies Owners:** Sends direct Slack DMs to task owners once tasks are active.
5. **Generates Digests:** A scheduled agent composes a 9 AM daily standup digest.
6. **Institutional Memory:** A conversational agent can answer questions like *"What did we decide about X?"* based on the `decisions` table.

## 🏗️ Architecture (Built on Lemma)

MeetLoop deeply utilizes the Lemma SDK ecosystem:
*   **4 Tables:** `meetings`, `action_items`, `decisions`, `blockers`.
*   **5 Agents:** `transcript_intake_agent`, `action_extractor_agent`, `owner_notifier_agent`, `digest_composer_agent`, `memory_agent`.
*   **2 Functions:** `commitment_confidence_score` (CCS algorithm) and `dependency_linker`.
*   **2 Workflows:** `meeting_ingestion_workflow` (7-step pipeline) and `daily_digest_workflow`.
*   **1 App:** `meetloop_dashboard` (A stunning, OLED Dark-mode React SPA bundled into a single file).

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v24+)
*   Python environment with `uv` (for Lemma CLI)
*   Lemma CLI (v0.5.4)

### 1. Authenticate with Lemma
```bash
lemma auth login
```

### 2. Start the Lemma Daemon
Start the daemon to expose the local MCP and SDK endpoints:
```bash
lemma daemon start
lemma daemon status  # Ensure it runs on 127-0-0-1.sslip.io:3711
```

### 3. Run the Dashboard Locally
The dashboard is built with React, Vite, and TailwindCSS v4.
```bash
cd dashboard
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Deploy to Lemma
We use `vite-plugin-singlefile` to bundle the app into a single `index.html` as required.
```bash
cd dashboard
npm run build
cp dist/index.html ../index.html
cd ..
lemma apps deploy --pod meetloop -y meetloop_dashboard ./index.html
```

## 🎨 Design Philosophy
The dashboard is built strictly without templated "AI slop". It utilizes an OLED-optimized Dark Mode, high-contrast UI tokens, native `Geist` typography, and smooth micro-animations. It is designed to feel like a premium, state-of-the-art enterprise tool.

---
*Built with ❤️ for the Gappy AI Hackathon.*
