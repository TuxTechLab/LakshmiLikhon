# LOOP.md

# LakshmiLikhon - Autonomous Engineering Loop

This document defines how OpenCode should continuously work on the LakshmiLikhon project.

The engineering loop is:

```
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
```

The agent must not consider a task complete merely because code was written.

---

# 1. Core Loop

For every task:

```
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
```

---

# 2. Phase-Specific Loops

## Phase 1: Next.js Setup
```
PLAN: Initialize Next.js, Tailwind, Framer Motion
→ IMPLEMENT: Create frontend/ directory, install deps, configure
→ TEST: Verify dev server starts, pages render
→ REVIEW: Check component structure, Tailwind config
→ DEBUG: Fix any build errors
→ RE-TEST: Confirm clean build
→ INTEGRATE: Update docker-compose.yml
→ DOCUMENT: Update plan.md, README.md
→ DEPLOY: docker compose build && up
→ VERIFY: Frontend accessible on port 3001
→ NEXT TASK: Admin Authentication
```

## Phase 2: Admin Authentication
```
PLAN: Design auth flow, DB schema, API endpoints
→ IMPLEMENT: Migration, JWT utils, auth routes, login page
→ TEST: Login/logout flow, protected routes, cookie handling
→ REVIEW: Security (httpOnly cookies, password hashing)
→ DEBUG: Fix auth edge cases
→ RE-TEST: Full auth flow
→ INTEGRATE: Connect frontend to auth API
→ DOCUMENT: Update API docs, env vars
→ DEPLOY: docker compose build && up
→ VERIFY: Admin can login, access protected routes
→ NEXT TASK: Frontend Migration
```

## Phase 3: Frontend Migration
```
PLAN: Map existing pages to Next.js routes, design components
→ IMPLEMENT: Convert each page (Dashboard, Create, History, View)
→ TEST: Each page renders, forms work, API calls succeed
→ REVIEW: Component reuse, code quality, responsiveness
→ DEBUG: Fix rendering issues, API integration bugs
→ RE-TEST: Full user flow (create → view → print)
→ INTEGRATE: Replace old public/ with Next.js
→ DOCUMENT: Update component docs
→ DEPLOY: docker compose build && up
→ VERIFY: All features work in new frontend
→ NEXT TASK: Animations
```

## Phase 4: Animations
```
PLAN: Identify animation points (transitions, hover, loading)
→ IMPLEMENT: Add Framer Motion to pages and components
→ TEST: Smooth animations, no performance issues
→ REVIEW: Animation timing, accessibility (prefers-reduced-motion)
→ DEBUG: Fix janky animations
→ RE-TEST: Cross-browser, mobile
→ INTEGRATE: Merge animation branch
→ DOCUMENT: Animation patterns in README
→ DEPLOY: docker compose build && up
→ VERIFY: Animations smooth, no regressions
→ NEXT TASK: Final Polish & Documentation
```

---

# 3. Subagent Delegation Rules

When delegating to subagents during the loop:

| Phase | Subagent Type | Task |
|-------|--------------|------|
| PLAN | explore | Research existing patterns, check dependencies |
| IMPLEMENT | general | Write code, create files, install packages |
| TEST | general | Run tests, verify builds, check endpoints |
| REVIEW | explore | Code review, check for issues |
| DEBUG | general | Fix identified issues |
| DOCUMENT | general | Update docs, README, plan.md |

Always verify subagent output before marking a task complete.

---

# 4. Completion Criteria

A phase is complete only when:

- [ ] Code is written and working
- [ ] Tests pass (unit + integration)
- [ ] Docker build succeeds
- [ ] docker compose up starts all services
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Documentation updated
- [ ] Git commit ready (if requested)

---

# 5. Emergency Rollback

If a phase breaks existing functionality:

1. Stop containers
2. Revert to last known good state
3. Identify root cause
4. Fix before proceeding
5. Re-run full test suite

Never proceed with a broken build.
