# Project Initiation Document

## CaseFlow — Client Intake & Triage Tool
**Core Product Feature**

---

**Document Version:** 1.0  
**Date:** February 2026  
**Author:** Phillip  
**Status:** In Development

---

## 1. Executive Summary

This document outlines the development of CaseFlow — a client intake and triage tool designed for social services teams, charities, and healthcare organisations. The tool enables frontline workers to capture referrals, automatically assess priority based on risk factors, and track cases through to resolution.

CaseFlow follows the same technical architecture as PIPHelper: a React/TypeScript PWA with offline capability, localStorage persistence, and zero backend requirements. This approach enables rapid deployment, complete data privacy, and accessibility for organisations without IT infrastructure.

**Primary Purpose:** Enable social services teams to manage client referrals efficiently with automatic triage, replacing paper forms, spreadsheets, and email-based workflows.

**Secondary Purpose:** Demonstrate a reusable architecture for form-heavy, offline-capable tools that can be adapted for multiple client contexts.

---

## 2. Project Background

### 2.1 Context

Small to medium social services organisations face a gap in available tools:

- **Paper/spreadsheet systems** are error-prone, hard to search, and create compliance risks
- **Enterprise case management systems** (Salesforce, Mosaic, Liquidlogic) cost £50k+ and require months of implementation
- **Generic form tools** (Google Forms, Typeform) lack triage logic, case tracking, and offline capability

There is significant demand for a middle-ground solution: a proper intake system that's affordable, quick to deploy, works offline for field workers, and doesn't require IT infrastructure or ongoing maintenance contracts.

### 2.2 Strategic Fit

CaseFlow extends the product portfolio into operational tools for social services, complementing the benefits-focused Entitle calculator. It demonstrates capability in:

- Multi-step form workflows with conditional logic
- Automatic scoring/triage based on configurable rules
- Dashboard and list views for case management
- Offline-first PWA architecture
- Data export and reporting

### 2.3 Target Users

| User Type | Primary Needs |
|-----------|---------------|
| Frontline workers | Quick intake form completable during/after client contact; mobile-friendly for field work |
| Team leads | Dashboard to monitor workload, assign cases, identify bottlenecks |
| Managers | Reporting on volumes, response times, outcomes |
| Clients (optional) | Self-referral form on organisation's website |

### 2.4 Target Organisations

- NHS community mental health teams (e.g., Early Intervention in Psychosis)
- Housing support charities
- Domestic abuse services
- Drug and alcohol services
- Youth offending teams
- Refugee resettlement programmes
- Carer support services
- Local authority social care teams

---

## 3. Project Objectives

### 3.1 Primary Objectives

| Objective | Success Measure |
|-----------|-----------------|
| Launch functional intake and triage tool | Tool deployed and accessible via URL |
| Enable automatic priority assessment | Triage scoring matches manual assessment in >85% of test cases |
| Support offline use for field workers | Full functionality available without network connection |
| Achieve sub-3-minute intake completion | Average form completion time under 3 minutes |

### 3.2 Secondary Objectives

| Objective | Success Measure |
|-----------|-----------------|
| Create configurable triage rules | Organisations can adjust weightings without code changes |
| Enable data export | CSV/JSON export of all cases for reporting |
| Build reusable component library | Form, dashboard, and list components extractable for future tools |
| Establish PWA template | Architecture documented and reusable for similar projects |

---

## 4. Scope

### 4.1 In Scope

**Core Features:**

1. **Intake Form**
   - Multi-step form with progress indicator
   - Conditional logic (fields appear/hide based on previous answers)
   - Client details, referral information, risk assessment, consent
   - Auto-save during completion
   - Validation with clear error messages

2. **Triage Engine**
   - Automatic priority scoring based on weighted risk factors
   - Four priority levels: Low, Medium, High, Urgent
   - Suggested response timeframes
   - Automatic flags for safeguarding, crisis, children at risk

3. **Case Dashboard**
   - Inbox view: new referrals awaiting triage/assignment
   - Active cases view: cases being worked with status and alerts
   - My caseload view: filtered to current user
   - Search and filter by name, status, priority, date range

4. **Case Detail View**
   - Full referral information
   - Activity timeline (all actions and notes)
   - Status updates and assignment
   - Add notes functionality
   - Close/archive with outcome recording

5. **Data Management**
   - All data stored in localStorage (no backend required)
   - Export to CSV and JSON
   - Clear all data option
   - Import from JSON (for data migration/backup)

6. **PWA Capability**
   - Installable as app on any device
   - Full offline functionality
   - Background sync when connection restored (future)

7. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation throughout
   - Screen reader support
   - Text size and contrast controls
   - Mobile-responsive design

### 4.2 Out of Scope (Future Phases)

- User authentication and multi-user access control
- Backend database (Supabase integration)
- Document uploads and storage
- Email/SMS notifications
- Calendar integration for appointments
- Reporting dashboards with charts
- API integrations (NHS Spine, local authority systems)
- Multi-tenancy for SaaS deployment

### 4.3 Assumptions

- Single-user or shared-device usage model for MVP (no login required)
- Organisations will manage access via device/browser controls
- Data volumes manageable in localStorage (<5MB typical)
- Users have modern browsers (Chrome, Firefox, Safari, Edge)

### 4.4 Constraints

- No backend infrastructure in current phase
- localStorage size limits (~5-10MB depending on browser)
- Single-device data (no sync between devices without export/import)
- Development time targeted at 8-12 hours for MVP

---

## 5. Technical Approach

### 5.1 Technology Stack

Following PIPHelper architecture:

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 19 | Component-based UI, excellent ecosystem, team familiarity |
| **Language** | TypeScript 5.9 | Type safety, better IDE support, fewer runtime errors |
| **Build Tool** | Vite 5 | Fast dev server, optimised production builds, PWA plugin |
| **Styling** | Tailwind CSS 3 | Rapid development, consistent design system, small bundle |
| **Routing** | React Router 6 | Client-side routing, nested routes, URL state |
| **PWA** | Vite PWA Plugin + Workbox | Service worker generation, offline caching, install prompt |
| **State** | React Context + useReducer | Sufficient for app complexity, no external dependency |
| **Persistence** | localStorage | Zero backend, offline-first, privacy-preserving |
| **Deployment** | Vercel | Free tier, instant deploys, good performance |

### 5.2 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CaseFlow                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                        Pages                                 │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │    │
│  │  │  Home    │ │  Intake  │ │Dashboard │ │  Case    │       │    │
│  │  │          │ │  Form    │ │          │ │  Detail  │       │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      Components                              │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐              │    │
│  │  │   Layout   │ │     UI     │ │    Form    │              │    │
│  │  │            │ │            │ │            │              │    │
│  │  │ • Header   │ │ • Button   │ │ • TextInput│              │    │
│  │  │ • Footer   │ │ • Card     │ │ • Select   │              │    │
│  │  │ • Nav      │ │ • Badge    │ │ • Radio    │              │    │
│  │  │ • Progress │ │ • Alert    │ │ • Checkbox │              │    │
│  │  │            │ │ • Table    │ │ • Textarea │              │    │
│  │  │            │ │ • Modal    │ │ • DatePick │              │    │
│  │  └────────────┘ └────────────┘ └────────────┘              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                       Context                                │    │
│  │  ┌──────────────────┐  ┌──────────────────┐                 │    │
│  │  │   CaseContext    │  │ AccessibilityCtx │                 │    │
│  │  │                  │  │                  │                 │    │
│  │  │ • cases[]        │  │ • textSize       │                 │    │
│  │  │ • currentCase    │  │ • highContrast   │                 │    │
│  │  │ • addCase()      │  │ • reducedMotion  │                 │    │
│  │  │ • updateCase()   │  │                  │                 │    │
│  │  │ • deleteCase()   │  │                  │                 │    │
│  │  └──────────────────┘  └──────────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Utils & Data                              │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐              │    │
│  │  │  triage.ts │ │ storage.ts │ │ formConfig │              │    │
│  │  │            │ │            │ │   .ts      │              │    │
│  │  │ • calculate│ │ • save     │ │            │              │    │
│  │  │   Score()  │ │ • load     │ │ • sections │              │    │
│  │  │ • getFlags │ │ • export   │ │ • fields   │              │    │
│  │  │ • getPrior │ │ • import   │ │ • validation│             │    │
│  │  └────────────┘ └────────────┘ └────────────┘              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     localStorage                             │    │
│  │                                                              │    │
│  │  caseflow_cases: Case[]                                      │    │
│  │  caseflow_settings: { textSize, highContrast }              │    │
│  │  caseflow_draft: Partial<Case>  (auto-save during intake)   │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  No backend. No database. Everything stays on the device.           │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Project Structure

```
CaseFlow/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite + PWA configuration
├── tailwind.config.js            # Custom theme (matching PIPHelper)
├── tsconfig.json                 # TypeScript config
├── vercel.json                   # Deployment config
│
├── public/                       # Static assets
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
│
├── src/
│   ├── App.tsx                   # Routing & layout
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles & a11y
│   ├── types.ts                  # TypeScript interfaces
│   ├── vite-env.d.ts             # Vite environment types
│   │
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Intake.tsx            # Multi-step intake form
│   │   ├── Dashboard.tsx         # Case list views
│   │   ├── CaseDetail.tsx        # Individual case view
│   │   └── Settings.tsx          # Export, import, clear data
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Nav + accessibility controls
│   │   │   ├── Footer.tsx        # Disclaimer
│   │   │   └── ProgressBar.tsx   # Form progress indicator
│   │   ├── ui/
│   │   │   ├── Button.tsx        # Reusable button (variants)
│   │   │   ├── Card.tsx          # Card container
│   │   │   ├── Badge.tsx         # Status/priority badges
│   │   │   ├── Alert.tsx         # Info/warning/error alerts
│   │   │   ├── Modal.tsx         # Confirmation dialogs
│   │   │   └── Table.tsx         # Sortable data table
│   │   └── form/
│   │       ├── TextInput.tsx     # Text field with validation
│   │       ├── Select.tsx        # Dropdown select
│   │       ├── RadioGroup.tsx    # Radio button group
│   │       ├── Checkbox.tsx      # Checkbox with label
│   │       ├── Textarea.tsx      # Multi-line text input
│   │       └── DatePicker.tsx    # Date input
│   │
│   ├── context/
│   │   ├── CaseContext.tsx       # Case state + localStorage sync
│   │   └── AccessibilityContext.tsx  # Text size & contrast
│   │
│   ├── data/
│   │   ├── formConfig.ts         # Intake form field definitions
│   │   └── triageRules.ts        # Triage weights and thresholds
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # localStorage with sync
│   │   ├── usePWAInstall.ts      # PWA install prompt
│   │   └── useAutoSave.ts        # Debounced form auto-save
│   │
│   └── utils/
│       ├── triage.ts             # Priority calculation
│       ├── storage.ts            # Export/import functions
│       ├── validation.ts         # Form validation rules
│       └── dates.ts              # Date formatting helpers
│
└── dist/                         # Production build output
    ├── sw.js                     # Service worker
    ├── manifest.webmanifest      # PWA manifest
    └── assets/                   # Bundled JS/CSS
```

### 5.4 Data Model

```typescript
// src/types.ts

interface Case {
  id: string;                     // UUID
  status: 'new' | 'triaged' | 'assigned' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  triageScore: number;            // 0-100
  flags: string[];                // Auto-generated alerts
  
  // Client details
  client: {
    fullName: string;
    dateOfBirth: string;          // ISO date
    phone?: string;
    email?: string;
    address?: string;
    postcode?: string;
    preferredContact: 'phone' | 'email' | 'text' | 'letter';
    communicationNeeds: string[];  // e.g., ['interpreter_required', 'easy_read']
    gpPractice?: string;
    nhsNumber?: string;
  };
  
  // Referral details
  referral: {
    source: 'self' | 'gp' | 'hospital' | 'social_services' | 'police' | 'charity' | 'family' | 'other';
    referrerName?: string;
    referrerOrganisation?: string;
    referrerContact?: string;
    dateReceived: string;         // ISO date
    reasons: string[];            // Multi-select referral reasons
    supportRequested: string;     // Free text
  };
  
  // Risk assessment
  risk: {
    riskToSelf: 'none' | 'low' | 'medium' | 'high';
    riskToOthers: 'none' | 'low' | 'medium' | 'high';
    riskFromOthers: 'none' | 'low' | 'medium' | 'high';
    childrenInHousehold: boolean;
    numberOfChildren?: number;
    safeguardingConcerns: boolean;
    safeguardingDetails?: string;
    urgency: 'routine' | 'soon' | 'urgent' | 'crisis';
  };
  
  // Consent
  consent: {
    shareInformation: boolean;
    contactClient: boolean;
    preferredTimes: string[];
    barriersToEngagement?: string;
  };
  
  // Case management
  assignedTo?: string;            // Worker name (free text for MVP)
  notes: Note[];
  outcome?: {
    type: 'engaged' | 'declined' | 'referred_on' | 'no_contact' | 'not_eligible' | 'other';
    details?: string;
    closedDate: string;
  };
  
  // Timestamps
  createdAt: string;              // ISO datetime
  updatedAt: string;              // ISO datetime
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy?: string;             // Worker name
}
```

### 5.5 Triage Configuration

```typescript
// src/data/triageRules.ts

export const triageWeights = {
  riskToSelf: {
    none: 0,
    low: 10,
    medium: 30,
    high: 50
  },
  riskToOthers: {
    none: 0,
    low: 10,
    medium: 25,
    high: 45
  },
  riskFromOthers: {
    none: 0,
    low: 10,
    medium: 25,
    high: 45
  },
  safeguardingConcerns: {
    false: 0,
    true: 40
  },
  urgency: {
    routine: 0,
    soon: 15,
    urgent: 35,
    crisis: 50
  },
  childrenInHousehold: {
    false: 0,
    true: 10
  }
};

export const priorityThresholds = {
  low: { min: 0, max: 20, response: '10 working days' },
  medium: { min: 21, max: 40, response: '5 working days' },
  high: { min: 41, max: 60, response: '48 hours' },
  urgent: { min: 61, max: 100, response: 'Same day' }
};

export const autoFlags = [
  { condition: (c: Case) => c.risk.riskToSelf === 'high', flag: 'Crisis assessment required' },
  { condition: (c: Case) => c.risk.safeguardingConcerns, flag: 'Safeguarding referral required' },
  { condition: (c: Case) => c.risk.childrenInHousehold && c.risk.riskFromOthers !== 'none', flag: 'Children\'s services notification' },
  { condition: (c: Case) => c.risk.urgency === 'crisis', flag: 'Immediate response required' }
];
```

---

## 6. User Experience Design

### 6.1 Design Principles

Following PIPHelper's approach:

1. **Calm and professional** — Blue/slate colour palette, no red except for genuine errors, no flashing or animation
2. **Progressive disclosure** — Show only relevant fields, collapse optional sections
3. **Plain English** — Avoid jargon, explain terms where needed
4. **Offline-first** — Never lose data, always indicate save status
5. **Accessible by default** — High contrast, resizable text, keyboard navigable

### 6.2 Colour Palette

```css
/* Matching PIPHelper's accessible theme */
--primary: #2563eb;        /* Blue 600 - primary actions */
--primary-dark: #1d4ed8;   /* Blue 700 - hover states */
--background: #f8fafc;     /* Slate 50 - page background */
--surface: #ffffff;        /* White - cards and forms */
--text: #1e293b;           /* Slate 800 - body text */
--text-muted: #64748b;     /* Slate 500 - secondary text */
--border: #e2e8f0;         /* Slate 200 - borders */
--success: #16a34a;        /* Green 600 - success states */
--warning: #d97706;        /* Amber 600 - warnings */
--error: #dc2626;          /* Red 600 - errors only */

/* Priority badge colours */
--priority-low: #e2e8f0;       /* Slate 200 */
--priority-medium: #fef3c7;    /* Amber 100 */
--priority-high: #fed7aa;      /* Orange 200 */
--priority-urgent: #fecaca;    /* Red 200 */
```

### 6.3 Key Screens

**1. Home**
- Brief explanation of the tool
- "New referral" primary CTA
- "View cases" secondary CTA
- Install as app prompt

**2. Intake Form**
- Progress bar showing current section
- One section visible at a time
- Clear "Back" and "Continue" navigation
- Auto-save indicator
- "Save and exit" option to return later

**3. Dashboard**
- Tab navigation: Inbox / Active / My Cases
- Sortable table with key columns
- Priority badges with colour coding
- Quick actions (View, Assign, Close)
- Search bar and date filter

**4. Case Detail**
- Header with client name, status badge, priority badge
- Tabbed content: Details / Notes / Timeline
- "Add note" action
- "Update status" action
- "Close case" action with outcome selection

---

## 7. Accessibility Requirements

Following PIPHelper's WCAG 2.1 AA implementation:

| Feature | Implementation |
|---------|----------------|
| Keyboard navigation | Full tab/enter/space support, visible focus rings |
| Screen readers | ARIA labels, roles, live regions for dynamic content |
| Text size | Adjustable 0.8x–1.5x via header controls, stored in localStorage |
| High contrast | Toggle in header, increases contrast ratios |
| Focus indicators | 2px solid blue outline on all interactive elements |
| Skip link | "Skip to main content" for keyboard users |
| Reduced motion | Respects `prefers-reduced-motion` media query |
| Touch targets | Minimum 44x44px for all interactive elements |
| Error identification | Errors announced, fields marked, suggestions provided |

---

## 8. Project Timeline

### 8.1 Development Schedule

| Phase | Activities | Duration | Status |
|-------|------------|----------|--------|
| **Setup** | Project scaffolding, Vite config, Tailwind theme, PWA setup | 1 hour | Pending |
| **Data Layer** | Types, context, localStorage hooks, triage logic | 2 hours | Pending |
| **Intake Form** | Multi-step form, validation, auto-save | 3 hours | Pending |
| **Dashboard** | Case list, filtering, search, table component | 2 hours | Pending |
| **Case Detail** | Detail view, notes, status updates, close flow | 2 hours | Pending |
| **Polish** | Accessibility audit, responsive testing, PWA testing | 1 hour | Pending |
| **Deployment** | Vercel setup, domain, final testing | 1 hour | Pending |
| **Total** | | **12 hours** | |

### 8.2 Milestones

| Milestone | Deliverable | Target |
|-----------|-------------|--------|
| M1 | Working intake form with auto-save | Hour 6 |
| M2 | Dashboard with case list and triage display | Hour 8 |
| M3 | Case detail view with notes and status | Hour 10 |
| M4 | Deployed PWA with offline support | Hour 12 |

---

## 9. Quality Assurance

### 9.1 Test Personas

| Persona | Scenario | Expected Outcome |
|---------|----------|------------------|
| Maria, support worker | Completes intake for crisis referral with safeguarding concerns | Priority: Urgent, Flags: Safeguarding + Crisis |
| James, team lead | Reviews inbox, assigns 3 cases, closes 1 | Cases move through statuses correctly |
| Sarah, field worker | Starts intake, loses connection, returns later | Draft restored from localStorage |
| Ahmed, manager | Exports all cases to CSV for monthly report | Valid CSV with all fields |

### 9.2 Acceptance Criteria

- [ ] Intake form captures all required fields with validation
- [ ] Triage score calculates correctly for all test personas
- [ ] Auto-save preserves draft every 5 seconds
- [ ] Dashboard displays all cases with correct status and priority
- [ ] Case detail allows adding notes and updating status
- [ ] Export produces valid CSV and JSON
- [ ] PWA installs and works fully offline
- [ ] All interactive elements keyboard accessible
- [ ] No accessibility errors in aXe audit
- [ ] Loads in under 2 seconds on 3G

---

## 10. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| localStorage limits exceeded | Low | High | Monitor size, implement data archiving, warn at 80% capacity |
| Data loss from browser clear | Medium | High | Prominent export reminder, auto-backup prompt |
| Complex form slows completion | Medium | Medium | Optimise for common paths, make optional fields collapsible |
| Triage logic edge cases | Medium | Medium | Include "manual override" option, log triage reasoning |
| Offline sync conflicts | Low | Medium | Out of scope for MVP (single device model) |

---

## 11. Future Enhancements

Documented for future phases, explicitly out of scope for MVP:

1. **User authentication** — Supabase Auth for multi-user access
2. **Cloud database** — Supabase PostgreSQL with row-level security
3. **Team features** — User roles, case assignment, workload view
4. **Notifications** — Email alerts for overdue cases, new assignments
5. **Document uploads** — Attach files to cases (Supabase Storage)
6. **Reporting dashboard** — Charts for volumes, response times, outcomes
7. **Self-referral portal** — Public-facing form for client self-referral
8. **API integrations** — NHS Spine lookup, local authority systems
9. **Audit trail** — Full history of all changes for compliance
10. **Multi-tenancy** — SaaS deployment for multiple organisations

---

## 12. Success Metrics

### 12.1 Launch Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tool deployed and accessible | Live URL | Manual verification |
| Triage accuracy vs manual assessment | >85% match | Test case comparison |
| Form completion time | <3 minutes | Stopwatch test |
| Lighthouse PWA score | >90 | Lighthouse audit |
| Accessibility score | 0 errors | aXe audit |

### 12.2 Usage Metrics (Post-Launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Intake completion rate | >80% | localStorage analytics |
| Cases created per week | Baseline | localStorage analytics |
| Average time to first contact | Track | Calculated from timestamps |

---

## 13. Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Owner | Phillip | | |
| Developer | Phillip | | |

---

## Appendix A: Intake Form Field Specification

### Section 1: Client Details

| Field | ID | Type | Required | Validation |
|-------|-----|------|----------|------------|
| Full name | `client.fullName` | text | ✓ | Min 2 chars |
| Date of birth | `client.dateOfBirth` | date | ✓ | Valid date, not future |
| Phone | `client.phone` | tel | | UK phone format |
| Email | `client.email` | email | | Valid email format |
| Address | `client.address` | textarea | | |
| Postcode | `client.postcode` | text | | UK postcode format |
| Preferred contact | `client.preferredContact` | select | | |
| Communication needs | `client.communicationNeeds` | multiselect | | |
| GP practice | `client.gpPractice` | text | | |
| NHS number | `client.nhsNumber` | text | | 10 digits |

### Section 2: Referral Information

| Field | ID | Type | Required | Validation |
|-------|-----|------|----------|------------|
| Referral source | `referral.source` | select | ✓ | |
| Referrer name | `referral.referrerName` | text | If external | |
| Referrer organisation | `referral.referrerOrganisation` | text | If external | |
| Referrer contact | `referral.referrerContact` | text | If external | |
| Date received | `referral.dateReceived` | date | ✓ | Not future |
| Reasons for referral | `referral.reasons` | multiselect | ✓ | Min 1 |
| Support requested | `referral.supportRequested` | textarea | ✓ | Min 10 chars |

### Section 3: Risk Assessment

| Field | ID | Type | Required | Triage Weight |
|-------|-----|------|----------|---------------|
| Risk to self | `risk.riskToSelf` | select | ✓ | 0-50 |
| Risk to others | `risk.riskToOthers` | select | ✓ | 0-45 |
| Risk from others | `risk.riskFromOthers` | select | ✓ | 0-45 |
| Children in household | `risk.childrenInHousehold` | boolean | ✓ | 0-10 |
| Number of children | `risk.numberOfChildren` | number | If yes | |
| Safeguarding concerns | `risk.safeguardingConcerns` | boolean | ✓ | 0-40 |
| Safeguarding details | `risk.safeguardingDetails` | textarea | If yes | |
| Urgency | `risk.urgency` | select | ✓ | 0-50 |

### Section 4: Consent

| Field | ID | Type | Required |
|-------|-----|------|----------|
| Consent to share information | `consent.shareInformation` | checkbox | ✓ |
| Consent to contact | `consent.contactClient` | checkbox | ✓ |
| Preferred times | `consent.preferredTimes` | multiselect | |
| Barriers to engagement | `consent.barriersToEngagement` | textarea | |

---

## Appendix B: Triage Score Examples

| Scenario | Risk Self | Risk Others | Risk From | Safeguard | Urgency | Children | Score | Priority |
|----------|-----------|-------------|-----------|-----------|---------|----------|-------|----------|
| Routine referral | None | None | None | No | Routine | No | 0 | Low |
| Mental health concerns | Low | None | None | No | Soon | No | 25 | Medium |
| Domestic abuse | None | None | High | Yes | Urgent | Yes | 130* | Urgent |
| Suicidal ideation | High | None | None | No | Crisis | No | 100 | Urgent |
| Housing support | None | None | Low | No | Soon | Yes | 35 | Medium |

*Capped at 100, flags generated for safeguarding and children

---

**Document End**
