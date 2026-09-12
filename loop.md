
---

# `loop.md`

This is the part I'd give OpenCode specifically for its autonomous/loop-engineering workflow.

```markdown
# LOOP.md

# Bill Generator - Autonomous Engineering Loop

This document defines how OpenCode should continuously work on the Bill Generator project.

The engineering loop is:

PLAN
→ IMPLEMENT
→ TEST
→ REVIEW
→ DEBUG
→ RE-TEST
→ INTEGRATE
→ DOCUMENT
→ DEPLOY
→ VERIFY
→ NEXT TASK

The agent must not consider a task complete merely because code was written.

---

# 1. Core Loop

For every task:

```text
┌───────────────┐
│     PLAN      │
└───────┬───────┘
        ↓
┌───────────────┐
│   IMPLEMENT   │
└───────┬───────┘
        ↓
┌───────────────┐
│     TEST      │
└───────┬───────┘
        ↓
   Tests pass?
      /    \
    NO      YES
    |        |
    v        v
 DEBUG     REVIEW
    |        |
    └───→────┘
             ↓
        DOCUMENT
             ↓
        INTEGRATE
             ↓
          DEPLOY
             ↓
          VERIFY
             ↓
        NEXT TASK
