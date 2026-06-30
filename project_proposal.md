# MeetLoop — AI Meeting-to-Execution Operator
### Hackathon Project Proposal | Gappy AI x Lemma SDK | June 2026

---

> **Problem Statement Track:** AI Meeting to Execution Operator (Official Statement #4)
> **Judging alignment:** 35% Problem Fit + 25% Product Judgment + 25% Execution + 15% SDK Use
> **Lemma Primitives:** Tables, Agents, Workflows, Functions, Approvals, Surfaces, App, Kit
> **Target user:** Startup founders / engineering leads who run 3-8 meetings per day

---

## 1. EXECUTIVE SUMMARY

**MeetLoop** turns the dead weight of meetings into live, trackable execution.

Every startup team runs daily standups, planning sessions, and client calls. The output of those meetings — decisions, action items, owners, deadlines — lives in a Notion doc or someone's memory for about 48 hours before it evaporates.

MeetLoop is a Lemma-powered pod that:
1. Accepts meeting transcripts (text paste, Telegram voice, or Slack message)
2. Extracts structured action items with owners, deadlines, and priority
3. Stores everything in a live execution board (Table)
4. Routes high-stakes decisions to a named approver before they become commits
5. Sends each owner a Slack DM with their tasks
6. Runs a daily 9 AM digest: what's overdue, what's due today, what's blocked
7. Lets the founder ask the pod: *"What did we decide about pricing last Tuesday?"*

The entire system is wired as a Lemma pod — one import, fully auditable, ready to template as a Kit.

---

## 2. PROBLEM STATEMENT & USER PERSONA

### Official Problem Statement Alignment
> **"AI Meeting to Execution Operator"** — Convert meeting notes/transcripts into action items, owners,
> deadlines, follow-ups, and live execution boards.
> *(Source: hackathon_blueprint.md — Official Problem Statement #4)*

### Primary User Persona

```
Name:    Arjun
Role:    Co-founder and CTO, 12-person early-stage startup (B2B SaaS)
Pain:    Runs 5 meetings/day. After every call he thinks "I will write the tasks later."
         He never does. Or he forgets someone else was supposed to own it.
         Three weeks later a customer follows up on something they agreed to.
         That thing was never tracked.
Reality: He uses Notion for docs, Slack for comms, and his brain for execution state.
         His brain is not reliable.
Cost:    1 dropped customer commitment = Rs.2L ARR risk.
```

### Why this wins on Problem Clarity (35% weight):
- Hyper-specific user (not "anyone who has meetings")
- Quantifiable pain (dropped commitments = measurable revenue risk)
- Existing workflows are known (Notion, Slack, brain)
- Problem is universal in the judging audience (startup founders)

---

## 3. WHY THIS IDEA WINS

### Scoring against judging rubric

| Criterion | Weight | MeetLoop Score | Rationale |
|-----------|--------|---------------|-----------|
| Problem clarity and real-world fit | 35% | HIGH | Judges are founders. They live this pain. Recognisable immediately. |
| Product judgment | 25% | HIGH | No wasted complexity. Each agent does exactly one job. Clear boundaries. |
| Execution quality | 25% | HIGH | Transcript to table to Slack DM to daily digest is fully demoable in 4 minutes. |
| SDK utilisation | 15% | HIGH | Uses Tables, Agents, Workflows, Functions, Approvals, Surfaces, App, Kit. |

### Blueprint-backed differentiators
- **Cross-surface design**: Transcript arrives via Telegram; approvals happen in Slack (blueprint insight)
- **Kits packaging**: The entire pod exports as a Kit (community template on Lemma website)
- **Observability**: 7-step workflow fully inspectable in Lemma Flow view during demo
- **Data model correctness**: 4 tables, typed columns, RLS per-owner on tasks
- **Innovation**: Commitment Confidence Score (CCS) — a custom function that routes low-confidence items to human review

---

## 4. INNOVATION & ORIGINALITY

### What makes MeetLoop genuinely new

**1. Commitment Confidence Score (CCS)**
A custom deterministic function scores each extracted action item 0-100 based on:
- Language certainty ("we will" = +10, "maybe" = -15)
- Presence of explicit deadline (+15 / -5)
- Named owner (TBD = -20, ambiguous = -10)
Items with CCS < 50 are flagged for human review before activation. This is a novel human-in-loop routing mechanism not found in any existing meeting tool.

**2. The Memory Agent**
Stores structured decisions (not just tasks) in a separate decisions table. The Memory Agent answers conversational queries like "What did we decide about pricing?" using Lemma's Conversations API with table context. Turns the pod into institutional memory.

**3. Cross-meeting dependency tracking**
The dependency_linker function detects task dependencies across meetings based on keyword and owner overlap, writing blocker rows to a join table. No meeting tool operates at this level of relational granularity.

**4. Packaged as a Lemma Kit**
The entire system is exportable as a Kit. Any team can install in 60 seconds. Directly targets the Project Track criteria (community template on Lemma website).

---

## 5. TECHNICAL DEPTH & AGENTIC DESIGN

### The 5-Agent Architecture

Each agent follows Lemma's design principle: one narrow job, explicit instructions, scoped access.

| Agent | Job | Tables Accessed |
|-------|-----|----------------|
| transcript_intake_agent | Classify meeting, extract metadata | meetings (write) |
| action_extractor_agent | Extract structured action items from transcript | action_items (write), meetings (read) |
| owner_notifier_agent | Draft and send Slack DM per owner | action_items (read, write) |
| digest_composer_agent | Compose daily status digest | action_items (read), meetings (read), decisions (read) |
| memory_agent | Answer founder queries about past decisions | meetings, action_items, decisions (all read) |

### The Triage Pipeline (from lemma.work/docs/guides/inbox-to-table)

```
surface -> agent -> function -> table -> approval (conditional)
```

MeetLoop implementation:
```
Telegram/Slack transcript arrives
  -> transcript_intake_agent (classify: meeting type, participants)
  -> action_extractor_agent (extract items: owner, deadline, description)
  -> commitment_confidence_score function (score each item 0-100)
  -> action_items table (write all items with CCS)
  -> Decision: CCS < 50?
      YES -> Approval Gate (founder reviews low-confidence items)
      NO  -> Skip to owner notification
  -> owner_notifier_agent (Slack DM to each owner)
  -> decisions table (write decisions extracted alongside tasks)
```

### Human-in-the-Loop (3 touchpoints)
1. **Approval Gate** — low-confidence items require founder sign-off before activation
2. **Daily Digest Review** — founder reviews overdue/blocked items every morning
3. **Conversational Query** — Memory Agent responds to human-initiated questions

### Why 5 agents instead of 1?
- Each is debuggable independently (run any agent in isolation via lemma agent run)
- Each has minimum-necessary access scope (security best practice)
- Each scores points on SDK utilisation separately
- Each is explainable in one sentence in the demo

---

## 6. REAL-WORLD IMPACT

### Quantified Pain

| Metric | Data |
|--------|------|
| Average meetings per knowledge worker/day | 4-6 |
| % of meeting action items completed on time | ~35% (Harvard Business Review) |
| % of founders who cite follow-through as #1 ops problem | >60% |
| Cost of one missed customer commitment (early SaaS) | Rs.50K-Rs.2L ARR risk |

### Before vs. After

| Before | After |
|--------|-------|
| Action items live in Notion pages no one re-reads | Action items in Table with status, owner, deadline |
| Owner assignment is verbal and forgotten | Every owner gets a Slack DM within 2 minutes |
| Follow-ups depend on founder's memory | Daily 9 AM digest shows overdue/due today/blocked |
| "What did we decide?" requires searching 4 tools | One query to Memory Agent answers instantly |
| Low-confidence commitments become ghost tasks | CCS < 50 items flagged for human review |

---

## 7. FULL LEMMA POD ARCHITECTURE

```
POD: meetloop
Tables:
  - meetings          (title, date, type, participants, transcript_raw, summary)
  - action_items      (description, owner, deadline, status, CCS, meeting_id, blockers)
  - decisions         (description, rationale, decided_by, status, meeting_id)
  - blockers          (blocking_item_id, blocked_item_id, detected_at, resolved_at)

Files:
  - team_context.md   (team members, Slack handles, domains of ownership)
  - agent_instructions/ (one .md per agent)

Agents:
  - transcript_intake_agent
  - action_extractor_agent
  - owner_notifier_agent
  - digest_composer_agent
  - memory_agent

Functions:
  - commitment_confidence_score  (CCS 0-100 per action item)
  - dependency_linker             (detect cross-task blockers)

Workflows:
  - meeting_ingestion_workflow    (transcript -> full pipeline, 7 steps)
  - daily_digest_workflow         (scheduled 9 AM, 2 steps)

Approvals:
  - low_confidence_review          (CCS < 50 -> founder review)

Surfaces:
  - Slack    (inbound transcripts, approvals, DMs, daily digest)
  - Telegram (alternative transcript input)

App:
  - meetloop_dashboard (Kanban execution board + Meeting history + Memory Agent chat)

Schedule:
  - daily_digest  (9:00 AM IST, Mon-Fri)
```

---

## 8. DATA MODEL — TABLES

### Table 1: meetings
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto (system) |
| title | text | Agent-extracted or user-provided |
| meeting_date | date | Extracted from transcript |
| meeting_type | enum | standup, planning, client_call, design_review, other |
| participants | text[] | Names extracted from transcript |
| transcript_raw | text | Full transcript text |
| summary | text | Agent-generated 2-3 sentence summary |
| created_at | datetime | Auto (system) |

### Table 2: action_items
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto (system) |
| meeting_id | foreign_key | Source meeting |
| description | text | What needs to be done |
| owner | text | Person responsible |
| owner_slack_handle | text | From team_context.md |
| deadline | date | Explicit or inferred |
| priority | enum | P1 / P2 / P3 |
| commitment_confidence_score | integer | 0-100 (function output) |
| status | enum | pending_review, active, in_progress, done, blocked, cancelled |
| dm_sent | boolean | Whether owner was DM'd |
| dm_sent_at | datetime | When DM was sent |
| created_at | datetime | Auto (system) |

> RLS: Each owner sees only their own rows in personal view. Team leads see all.

### Table 3: decisions
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto |
| meeting_id | foreign_key | Source meeting |
| description | text | What was decided |
| rationale | text | Why (if captured) |
| decided_by | text | Who made the call |
| status | enum | active, superseded, under_review |
| created_at | datetime | Auto |

### Table 4: blockers
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto |
| blocking_item_id | foreign_key | The upstream dependency |
| blocked_item_id | foreign_key | The item waiting |
| detected_at | datetime | When dependency was found |
| resolved_at | datetime | When unblocked |

---

## 9. AGENT JOB DESCRIPTIONS

### transcript_intake_agent
```
Role: Meeting Classifier
Access: meetings (write), Files/team_context.md (read)

You receive raw meeting transcript text. Your job:
1. Extract: meeting title, date, meeting type, list of participant names
2. Write 2-3 sentence summary
3. Create a new row in the meetings table
4. Return the meeting_id for downstream use

Output format: { meeting_id, title, meeting_type, participants, summary }
Never invent information not present in the transcript.
```

### action_extractor_agent
```
Role: Action Item Extractor
Access: action_items (write), meetings (read), Files/team_context.md (read)

You receive a meeting transcript and meeting_id. Your job:
1. Extract EVERY action item - anything a person committed to doing
2. For each item: description, owner, deadline, priority (P1/P2/P3)
3. Priority signals: "urgent/ASAP/critical" = P1; "this week/soon" = P2; else P3
4. Map owner names to Slack handles using team_context.md
5. Write one row per action item, status = pending_review
6. Also extract decisions: write to decisions table separately

Be EXHAUSTIVE. A missed action item is worse than a false positive.
```

### owner_notifier_agent
```
Role: Owner DM Dispatcher
Access: action_items (read, write), Slack surface (send)

For each unique owner with active items (status=active, dm_sent=false):
1. Collect all their items from the current meeting
2. Draft a friendly Slack DM:
---
Hi [Name]! From [meeting title]:
You have [N] action items:
1. [Description] - due [deadline] - [priority]
...
Reply here or update status in MeetLoop.
---
3. Send the DM via Slack surface
4. Update dm_sent = true, dm_sent_at = now()

Never mention AI. Keep tone warm but direct.
```

### digest_composer_agent
```
Role: Daily Execution Digest Composer
Access: action_items (read), meetings (read), decisions (read)

Compose a morning digest for the team channel:
- OVERDUE: deadline < today, status != done
- DUE TODAY: deadline = today
- BLOCKED: status = blocked (with blocker info)
- RECENTLY DECIDED: decisions from last 48 hours

Format as Slack markdown. Keep each section <= 5 items (summarize if more).
If all clear, send positive message instead.
```

### memory_agent
```
Role: Institutional Memory - Query Responder
Access: meetings, action_items, decisions (all read), Files/* (read)
Conversation type: TASK (conversational)

You answer questions about past meetings, decisions, and action items.
Always cite the specific meeting title and date.
If multiple conflicting decisions exist, surface both.
If you cannot find a clear answer, say so explicitly.
Respond in 2-4 sentences. Be concise.
```

---

## 10. WORKFLOW GRAPH

### meeting_ingestion_workflow (7 steps)

Trigger: New transcript received (Slack/Telegram surface OR manual)

```
STEP 1: transcript_intake_agent
  -> enriched meeting record created

STEP 2: action_extractor_agent
  -> N rows in action_items (status=pending_review)
  -> decisions written to decisions table

STEP 3: commitment_confidence_score (Function)
  -> CCS score per item updated in action_items

STEP 4: dependency_linker (Function)
  -> blockers table rows created for detected dependencies

STEP 5: DECISION - Any item with CCS < 50?
  YES -> STEP 5a: APPROVAL (low_confidence_review)
         Route to: founder/team lead
         On approve: status = active
         On dismiss: status = cancelled
  NO  -> Skip to STEP 6

STEP 6: Bulk status update - pending_review -> active
  (for all items that passed CCS check)

STEP 7: owner_notifier_agent
  -> Slack DMs sent to all owners
  -> dm_sent = true per item

END: Fully auditable in Lemma Flow view (all 7 steps visible).
```

### daily_digest_workflow (2 steps)

Trigger: Schedule - 9:00 AM IST, Mon-Fri

```
STEP 1: digest_composer_agent
  -> formatted Slack digest message

STEP 2: Post to #meetloop-daily Slack channel

END
```

---

## 11. FUNCTIONS (DETERMINISTIC LOGIC)

### commitment_confidence_score

```python
def commitment_confidence_score(item: dict) -> int:
    score = 50  # baseline
    description = item.get('description', '').lower()
    owner = item.get('owner', '')
    deadline = item.get('deadline')

    # Language certainty signals
    high_certainty = ['will', 'must', 'need to', 'committed', 'agreed', 'by end of']
    low_certainty = ['maybe', 'perhaps', 'should', 'consider', 'possibly', 'tbd']

    for phrase in high_certainty:
        if phrase in description:
            score += 10
            break

    for phrase in low_certainty:
        if phrase in description:
            score -= 15
            break

    if not owner or owner.strip().upper() == 'TBD':
        score -= 20
    elif '/' in owner:  # ambiguous owner
        score -= 10

    if deadline:
        score += 15
    else:
        score -= 5

    return max(0, min(100, score))

# Items scoring < 50 are routed to human approval before activation
```

### dependency_linker

```python
def dependency_linker(action_items: list) -> list:
    blockers = []
    blocker_keywords = ['after', 'once', 'when', 'depends on', 'blocked by', 'following', 'pending']

    for item in action_items:
        desc = item['description'].lower()
        for keyword in blocker_keywords:
            if keyword in desc:
                for other in action_items:
                    if other['id'] == item['id']:
                        continue
                    if other['owner'] == item['owner'] and other.get('deadline', '') < item.get('deadline', ''):
                        blockers.append({
                            'blocking_item_id': other['id'],
                            'blocked_item_id': item['id'],
                            'detected_at': 'now()'
                        })
                        break
    return blockers
```

---

## 12. SURFACE INTEGRATIONS

### Slack
- Inbound: #meetloop-intake channel -> triggers meeting_ingestion_workflow
- Outbound: Owner DMs, approval requests, daily digest (#meetloop-daily)
```bash
lemma connector create --type slack
lemma connector configure slack --channel meetloop-intake --trigger on_message
```

### Telegram
- Inbound: Voice note or text transcript to Lemma bot
- Long-polling (no public webhook needed - works locally)
- Cross-surface design: transcript via Telegram, tasks via Slack DM
```bash
lemma connector create --type telegram
lemma connector configure telegram --bot-token <token>
```

---

## 13. OPERATOR APP DESIGN

Deployed via: lemma apps deploy meetloop ./index.html

### 3-Panel Dashboard

View 1: Execution Board (Kanban)
- Columns: Pending Review | Active | In Progress | Blocked | Done
- Filters: By Owner | By Meeting | By Date
- SDK: useRecords (live updates), useUpdateRecord (drag status change)
- Pending Review column shows CCS score + Approve/Dismiss buttons

View 2: Meeting History
- List of all processed meetings
- Shows: date, type, item count, pending review count
- Click to drill into a specific meeting's items

View 3: Memory Agent Chat
- Embedded conversational interface
- SDK: useAssistantController + useAssistantRuntime
- Founder types: "What did we decide about pricing?"
- Agent responds with cited meeting + date

---

## 14. SDK CODE SNIPPETS

### Client setup
```typescript
import { LemmaClient } from 'lemma-sdk';

export const client = new LemmaClient({
  apiUrl: import.meta.env.VITE_LEMMA_API_URL,
  authUrl: import.meta.env.VITE_LEMMA_AUTH_URL,
  podId: import.meta.env.VITE_LEMMA_POD_ID,
});
await client.initialize();
```

### Live execution board
```typescript
import { useRecords, useUpdateRecord } from 'lemma-sdk/react';

function ExecutionBoard() {
  const { records: items } = useRecords(client, 'action_items', {
    filter: { status: { not: 'cancelled' } },
    orderBy: { deadline: 'asc' }
  });
  const { updateRecord } = useUpdateRecord(client, 'action_items');

  return (
    <Kanban
      items={items}
      columns={['pending_review', 'active', 'in_progress', 'blocked', 'done']}
      onStatusChange={(id, status) => updateRecord(id, { status })}
    />
  );
}
```

### Submit transcript and trigger workflow
```typescript
async function submitTranscript(text: string) {
  const meeting = await client.pod.tables.records.create('meetings', {
    transcript_raw: text,
    created_at: new Date().toISOString(),
  });
  await client.pod.workflows.start('meeting_ingestion_workflow', {
    meeting_id: meeting.id,
    transcript: text,
  });
  return meeting.id;
}
```

### Memory Agent conversation
```typescript
import { useConversationMessages } from 'lemma-sdk/react';

function MemoryChat() {
  const conversation = useConversationMessages({
    client,
    agentName: 'memory_agent',
    autoResume: true,
  });

  const ask = async (query: string) => {
    await conversation.createConversation({
      title: `Query: ${query.slice(0, 40)}`,
      instructions: 'Answer concisely, cite meeting and date.',
      type: 'TASK',
      setActive: true,
    });
    await conversation.sendMessage(query, {
      conversationId: conversation.conversationId,
    });
  };

  return <ChatUI messages={conversation.messages} onSend={ask} />;
}
```

### CLI setup sequence
```bash
# 1. Install and auth
uv tool install lemma-terminal
lemma skills install
lemma auth login
lemma pod create meetloop --with-starter --description "AI Meeting to Execution Operator"
lemma pods select meetloop --save-default

# 2. Create tables
lemma table create --pod-id <pod-id> --payload-file ./payloads/meetings-table.json
lemma table create --pod-id <pod-id> --payload-file ./payloads/action-items-table.json
lemma table create --pod-id <pod-id> --payload-file ./payloads/decisions-table.json
lemma table create --pod-id <pod-id> --payload-file ./payloads/blockers-table.json

# 3. Create functions
lemma function create --pod-id <pod-id> --payload-file ./payloads/ccs-function.json
lemma function create --pod-id <pod-id> --payload-file ./payloads/dependency-linker.json

# 4. Create agents
lemma agent create --pod-id <pod-id> --payload-file ./payloads/transcript-intake-agent.json
lemma agent create --pod-id <pod-id> --payload-file ./payloads/action-extractor-agent.json
lemma agent create --pod-id <pod-id> --payload-file ./payloads/owner-notifier-agent.json
lemma agent create --pod-id <pod-id> --payload-file ./payloads/digest-composer-agent.json
lemma agent create --pod-id <pod-id> --payload-file ./payloads/memory-agent.json

# 5. Create workflows
lemma workflow create --pod-id <pod-id> --payload-file ./payloads/ingestion-workflow.json
lemma workflow create --pod-id <pod-id> --payload-file ./payloads/daily-digest-workflow.json

# 6. Wire surfaces
lemma connector create --type slack
lemma connector configure slack --channel meetloop-intake --trigger on_message

# 7. Deploy app
lemma apps deploy meetloop ./index.html

# 8. Export as Kit
lemma pod export ./meetloop-kit
```

---

## 15. KIT PACKAGING STRATEGY

A Kit wraps the entire pod as a shareable, installable package.

Why this wins:
- Judges see scalability and Lemma mastery (blueprint insight)
- Directly targets Project Track criteria (community template)
- Takes 30 minutes once the pod is working

Kit installs: 4 tables + 5 agents + 2 functions + 2 workflows + 1 app + schedule

Kit README snippet:
```markdown
# MeetLoop Kit
Install in any pod to get a fully wired meeting-to-execution operator.
## After install
1. Add team in Files/team_context.md (names + Slack handles)
2. Connect Slack: connector -> Slack -> #meetloop-intake
3. Run test workflow with sample in /examples/sample.txt
```

---

## 16. DAY-BY-DAY BUILD PLAN

Current: June 26, 2026 | Deadline: June 30, 2026 | Days remaining: 4

### Day 1 (June 26 - TODAY): Foundation
- [ ] Sign up at lemma.work/auth OR run local install
- [ ] uv tool install lemma-terminal
- [ ] lemma skills install
- [ ] lemma auth login
- [ ] lemma pod create meetloop --with-starter
- [ ] Write all 4 table schemas as JSON payload files
- [ ] Create all 4 tables via CLI
- [ ] Write team_context.md file
- [ ] Write and create commitment_confidence_score function
- [ ] Write and create dependency_linker function
- [ ] Test both functions with dummy data

### Day 2 (June 27): Agents + Core Workflow
- [ ] Write all 5 agent instruction files
- [ ] Create all 5 agents via CLI
- [ ] Test transcript_intake_agent manually
- [ ] Test action_extractor_agent with same transcript
- [ ] Build meeting_ingestion_workflow (all 7 steps)
- [ ] Set up approval gate for CCS < 50
- [ ] Run workflow manually once with a real transcript
- [ ] Build daily_digest_workflow
- [ ] Verify owner_notifier_agent can send Slack DMs

### Day 3 (June 28): Surfaces + App
- [ ] Connect Slack surface via connector
- [ ] Test full pipeline: paste transcript in Slack -> workflow -> tasks in table
- [ ] Build meetloop_dashboard app (HTML + SDK)
- [ ] Wire useRecords for live action items view
- [ ] Wire useConversationMessages for Memory Agent chat
- [ ] Deploy: lemma apps deploy meetloop ./index.html
- [ ] Connect Telegram surface (optional but impressive)
- [ ] Export pod as Kit: lemma pod export ./meetloop-kit

### Day 4 (June 29): Polish + Demo Recording
- [ ] Fix all edge cases found in testing
- [ ] Write submission problem statement (4-5 sentences)
- [ ] Prepare demo script (see Section 17)
- [ ] Record screen recording (5-8 minutes)
- [ ] Fill submission form: https://tally.so/r/5BVxNM

### Day 5 (June 30 - DEADLINE): Submit
- [ ] Review screen recording quality
- [ ] Submit before midnight
- [ ] Share on Discord: https://discord.gg/6dVR7zTvy

---

## 17. DEMO SCRIPT (5-7 minutes)

**Opening (30s):**
"Startups run 5 meetings a day. The output evaporates within 48 hours. MeetLoop turns every meeting transcript into structured, tracked, executable work. Let me show you."

**Act 1 - Input (1 min):**
- Open Slack #meetloop-intake
- Paste a 200-word standup transcript (prepared in advance)
- Show Lemma receiving it via the Slack surface

**Act 2 - Pipeline Running (2 min):**
- Open workflow run view for meeting_ingestion_workflow
- Walk through each step live:
  - Step 1: Transcript Intake -> meeting record created
  - Step 2: Action Extractor -> 4 items extracted
  - Step 3: CCS Function -> one item scores 35/100 (show it)
  - Step 5: Approval Gate triggered -> show the notification
  - Approve it -> status changes to active
  - Step 7: Owner Notifier -> show the Slack DM sent

**Act 3 - Dashboard (1 min):**
- Open MeetLoop operator app
- Show Kanban board with 4 items
- Drag one item from active to in_progress

**Act 4 - Memory Agent (1 min):**
- Open Memory Agent chat panel
- Type: "What did we decide about the API refactor?"
- Show agent pulling from decisions table with cited date

**Act 5 - Daily Digest (30s):**
- Show the morning digest in #meetloop-daily
- "Every morning at 9 AM, the team knows exactly what is overdue, due today, and blocked."

**Close (30s):**
"One transcript in. Structured tasks out. Every owner DM'd. Every decision searchable. Ships as a Kit any team can install in 60 seconds."

---

## 18. SUBMISSION CHECKLIST

### Required (June 30)
- [ ] Problem statement written
- [ ] Screen recording complete (shows full core loop end-to-end)
- [ ] Team details filled in
- [ ] Submitted at: https://tally.so/r/5BVxNM

### Problem Statement (ready to paste)
"Early-stage startup founders and engineering leads lose action items, decisions, and commitments after every meeting. MeetLoop is an AI-powered Lemma pod that converts any meeting transcript into structured, tracked action items with owner assignment, deadline tracking, priority scoring, and automatic Slack notifications. A Commitment Confidence Score routes low-confidence items to human review before activation. A Memory Agent answers queries like 'What did we decide about pricing?' using the decisions table as institutional memory. The entire system ships as a Lemma Kit any team can install in 60 seconds."

---

## 19. CROSS-REFERENCE INDEX

| Concept | Source | Reference |
|---------|--------|-----------|
| Official Problem Statement #4 | hackathon_blueprint.md section 4 | "AI Meeting to Execution Operator" |
| Judging weights (35/25/25/15) | HACKATHON_RESEARCH.md section 5 | Problem clarity weighted highest |
| Kit packaging differentiator | hackathon_blueprint.md section 6 | Community template criterion |
| Triage architecture pattern | lemma.work/docs/guides/inbox-to-table | surface->agent->function->table->approval |
| Conversations API | lemma.work/docs/sdk/conversations | createForAgent, useConversationMessages |
| Cross-surface design bonus | HACKATHON_RESEARCH.md section 5 | Telegram in + Slack out |
| Kits concept | lemma.work/docs/concepts/kits | Everything installs at once, already wired |
| Agent design principles | lemma.work/docs/concepts/agents | One narrow job, explicit instructions, scoped access |
| Workflow pattern | lemma.work/docs/concepts/workflows | Mix AI steps with functions and approval gates |
| Functions vs agents | hackathon_blueprint.md section 2 | Deterministic logic for exact rules |
| Approval gates | lemma.work/docs/concepts/approvals | Pause where named person decides before work continues |
| SDK data hooks | lemma.work/docs/sdk/data-and-files | useRecords, useUpdateRecord for kanban |
| Operator app deployment | HACKATHON_RESEARCH.md section 8 | lemma apps deploy meetloop ./index.html |
| Table RLS | hackathon_blueprint.md section 3 | Per-owner row-level security on action_items |

---

*Proposal compiled: June 26, 2026*
*Cross-referenced from: gappy.ai, lemma.work docs (full tree), hackathon_blueprint.md, HACKATHON_RESEARCH.md*
*Build window: 4 days remaining (June 26-30, 2026)*
