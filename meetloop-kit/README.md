# MeetLoop — Pod Kit

This directory contains the full exported Lemma pod for **MeetLoop** (AI Meeting-to-Execution Operator).

## Installation in 3 Steps

1. **Connect Slack (Required)**
   First, you must connect a Slack workspace to your Lemma environment:
   ```bash
   lemma connector create --type slack
   ```
   *Follow the OAuth flow to install the app and copy the resulting `account_id`.*

2. **Import the Pod**
   Import the entire kit into your Lemma workspace:
   ```bash
   lemma pods import ./meetloop-kit/meetloop --var slack_account=<your_account_id_from_step_1>
   ```

3. **Deploy the Dashboard App**
   The React dashboard provides the frontend interface. Deploy it to your pod:
   ```bash
   cd dashboard
   npm run build
   lemma apps deploy meetloop ./dist/index.html
   ```

## Included Resources
- **Tables**: `meetings`, `action_items`, `decisions`, `blockers`
- **Agents**: Intake, Action Extractor, Owner Notifier, Digest Composer, Memory Agent
- **Workflows**: `meeting-ingestion-workflow` (7 steps), `daily-digest-workflow`
- **Functions**: `commitment_confidence_score`, `dependency_linker`, `activate_action_items`
- **Schedules**: `daily_digest` (Cron: 09:00 Mon-Fri)
- **Surfaces**: Slack `#meetloop-intake` channel routing
