# 📋 CaseFlow

**Streamlining client intake and triage for social services teams.**

Capture referrals → Auto-score risk → Track cases to resolution — all offline, all private.

![Status](https://img.shields.io/badge/status-live-brightgreen)
![React](https://img.shields.io/badge/react-19-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.7-blue)
![PWA](https://img.shields.io/badge/PWA-offline%20ready-purple)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

🔗 **Live App:** [caseflowuk.vercel.app](https://caseflowuk.vercel.app)

---

## ✨ What It Does

| Feature | Description |
|---------|-------------|
| 📝 **Guided Intake Form** | Four-section referral form with real-time validation and conditional fields |
| ⚖️ **Automatic Triage** | Risk-based scoring engine that calculates priority (Low / Medium / High / Urgent) |
| 📊 **Case Dashboard** | Tabbed inbox with search, priority filters, date ranges, and sortable columns |
| 📁 **Case Management** | Detailed case view with notes, timeline, status transitions, and structured closure |
| 💾 **Draft Auto-Save** | Unfinished referrals saved every 5 seconds — close the browser and come back anytime |
| 📱 **Install as App** | Works offline as a PWA on phone, tablet, or desktop |
| 📤 **Data Export** | Export all cases to CSV or JSON for reporting; import JSON for data portability |
| ♿ **Fully Accessible** | High contrast mode, text size controls, keyboard navigation, screen reader support |

---

## 🎬 Demo

> 🚧 **Screenshots coming soon**

<!--
TODO: Add screenshots
![Home Page](screenshots/home.png)
![Intake Form](screenshots/intake.png)
![Dashboard](screenshots/dashboard.png)
![Case Detail](screenshots/case-detail.png)
-->

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        CaseFlow                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐     ┌───────────────┐                   │
│  │   Home Page   │────▶│   Intake      │──── 4 steps ──┐   │
│  │               │     │   Form        │                │   │
│  │  • Quick stats│     │               │                │   │
│  │  • Feature    │     │  1. Client    │                │   │
│  │    overview   │     │  2. Referral  │                │   │
│  │  • Start CTA  │     │  3. Risk      │                │   │
│  └───────────────┘     │  4. Consent   │                │   │
│                        └───────────────┘                │   │
│                                                         ▼   │
│  ┌───────────────┐     ┌───────────────┐                    │
│  │   Settings    │     │  Dashboard    │◄── auto-triage     │
│  │               │     │               │                    │
│  │  • Export CSV │     │  • Inbox      │                    │
│  │  • Export JSON│     │  • Active     │                    │
│  │  • Import     │     │  • My Cases   │                    │
│  │  • Clear data │     │  • Search &   │                    │
│  └───────────────┘     │    filter     │                    │
│                        └──────┬────────┘                    │
│                               ▼                             │
│                        ┌───────────────┐                    │
│                        │ Case Detail   │                    │
│                        │               │                    │
│                        │  • Details    │                    │
│                        │  • Notes      │                    │
│                        │  • Timeline   │                    │
│                        │  • Close case │                    │
│                        └───────────────┘                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  localStorage                        │   │
│  │  • Cases & notes     • Accessibility prefs           │   │
│  │  • Draft forms       • User settings                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  No backend. No database. Everything stays on your device.  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Intake Form Sections

### 1. Client Details

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Date of Birth | Date | Yes |
| Phone Number | Tel | No |
| Email Address | Email | No |
| Address | Textarea | No |
| Postcode | Text (UK format) | No |
| Preferred Contact Method | Select | No |
| Communication Needs | Multi-select | No |
| GP Practice | Text | No |
| NHS Number | Text (10 digits) | No |

### 2. Referral Information

| Field | Type | Required |
|-------|------|----------|
| Referral Source | Select | Yes |
| Referrer Name | Text | Conditional |
| Referrer Organisation | Text | Conditional |
| Referrer Contact | Text | No |
| Date Referral Received | Date | Yes |
| Reasons for Referral | Multi-select | Yes |
| Support Requested | Textarea | Yes |

### 3. Risk Assessment

| Field | Type | Required |
|-------|------|----------|
| Risk to Self | Select (none–high) | Yes |
| Risk to Others | Select (none–high) | Yes |
| Risk from Others | Select (none–high) | Yes |
| Children in Household | Radio | Yes |
| Number of Children | Number | Conditional |
| Safeguarding Concerns | Radio | Yes |
| Safeguarding Details | Textarea | Conditional |
| Urgency | Select | Yes |

### 4. Consent

| Field | Type | Required |
|-------|------|----------|
| Share Information Consent | Checkbox | Yes |
| Contact Client Consent | Checkbox | Yes |
| Preferred Contact Times | Multi-select | No |
| Barriers to Engagement | Textarea | No |

---

## ⚖️ Triage Scoring

The scoring engine evaluates referrals across multiple risk dimensions and assigns a priority level automatically:

### Scoring Factors

| Factor | None | Low | Medium | High |
|--------|------|-----|--------|------|
| Risk to Self | 0 | 10 | 30 | 50 |
| Risk to Others | 0 | 10 | 25 | 45 |
| Risk from Others | 0 | 10 | 25 | 45 |
| Safeguarding Concerns | — | — | — | +40 |
| Children in Household | — | — | — | +10 |

| Urgency Level | Routine | Soon | Urgent | Crisis |
|---------------|---------|------|--------|--------|
| Points Added | 0 | 15 | 35 | 50 |

### Priority Thresholds

| Priority | Score Range | Response Time |
|----------|-------------|---------------|
| 🟢 **Low** | 0–20 | 10 working days |
| 🟡 **Medium** | 21–40 | 5 working days |
| 🟠 **High** | 41–60 | 48 hours |
| 🔴 **Urgent** | 61–100 | Same day |

### Auto-Flags

Cases are automatically flagged for immediate attention when:

| Flag | Trigger |
|------|---------|
| 🚨 **Crisis assessment required** | Risk to self is high |
| 🛡️ **Safeguarding referral required** | Safeguarding concerns present |
| 👶 **Children's services notification** | Children in household AND risk from others |
| ⚡ **Immediate response required** | Urgency is crisis |

---

## 📁 Case Management Workflow

```
new → triaged → assigned → in_progress → closed
```

| Status | Description | Next Actions |
|--------|-------------|-------------|
| **New** | Just submitted, awaiting review | Triage or assign |
| **Triaged** | Risk assessed, priority set | Assign to worker |
| **Assigned** | Worker allocated | Begin work |
| **In Progress** | Active case work underway | Close case |
| **Closed** | Case resolved with recorded outcome | — |

### Closure Outcomes

| Outcome | Description |
|---------|-------------|
| Engaged | Client engaged with service |
| Declined | Client declined support |
| Referred On | Referred to another service |
| No Contact | Unable to make contact |
| Not Eligible | Not eligible for service |
| Other | Other outcome |

---

## 🚀 Quick Start

### Run Locally

```bash
# Clone the repo
git clone https://github.com/PhillipTodorov/CaseFlow.git
cd CaseFlow

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
CaseFlow/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite + PWA configuration
├── tailwind.config.js            # Custom priority colour scale
├── tsconfig.json                 # TypeScript config
├── postcss.config.js             # PostCSS + Tailwind
├── vercel.json                   # Deployment config
│
├── public/                       # Static assets
│   └── favicon.svg
│
├── src/
│   ├── App.tsx                   # Routing & layout
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles & a11y
│   ├── types.ts                  # TypeScript interfaces
│   │
│   ├── pages/
│   │   ├── Home.tsx              # Landing page with quick stats
│   │   ├── Intake.tsx            # Multi-step referral form
│   │   ├── Dashboard.tsx         # Case inbox with filters & search
│   │   ├── CaseDetail.tsx        # Individual case view & management
│   │   └── Settings.tsx          # Export, import & preferences
│   │
│   ├── components/
│   │   ├── form/
│   │   │   ├── FieldRenderer.tsx # Smart field dispatcher by type
│   │   │   ├── TextInput.tsx     # Text / email / tel / number input
│   │   │   ├── Select.tsx        # Dropdown select
│   │   │   ├── RadioGroup.tsx    # Radio button group
│   │   │   ├── Checkbox.tsx      # Single checkbox
│   │   │   ├── Textarea.tsx      # Multi-line text area
│   │   │   └── DatePicker.tsx    # Date input
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Navigation + accessibility controls
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── ProgressBar.tsx   # Multi-step progress indicator
│   │   └── ui/
│   │       ├── Alert.tsx         # Colour-coded notifications
│   │       ├── Badge.tsx         # Priority & status badges
│   │       ├── Button.tsx        # Reusable button (4 variants)
│   │       ├── Card.tsx          # Container card
│   │       ├── Modal.tsx         # Dialog modal
│   │       └── Table.tsx         # Sortable data table
│   │
│   ├── context/
│   │   ├── CaseContext.tsx       # Case state + reducer + localStorage
│   │   └── AccessibilityContext.tsx  # Text size & contrast settings
│   │
│   ├── data/
│   │   ├── formConfig.ts        # Form sections & field definitions
│   │   └── triageRules.ts       # Triage weights & thresholds
│   │
│   ├── hooks/
│   │   ├── useAutoSave.ts       # Auto-save draft every 5 seconds
│   │   ├── useLocalStorage.ts   # localStorage wrapper with tab sync
│   │   └── usePWAInstall.ts     # PWA install prompt handler
│   │
│   └── utils/
│       ├── dates.ts             # Date formatting & UUID generation
│       ├── storage.ts           # localStorage ops + import/export
│       ├── triage.ts            # Triage calculation logic
│       └── validation.ts        # Form field validation rules
│
└── dist/                         # Production build output
    ├── sw.js                     # Service worker (auto-generated)
    ├── manifest.webmanifest      # PWA manifest
    └── assets/                   # Bundled JS/CSS
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19, TypeScript 5.7 |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router 6 |
| **PWA** | Vite PWA Plugin + Workbox |
| **Deployment** | Vercel |

---

## 🔐 Privacy & Data

**Everything stays on your device:**
- ✅ No backend server — runs entirely in your browser
- ✅ No database — all data stored in localStorage
- ✅ No tracking or analytics
- ✅ No cookies
- ✅ Works offline after first visit
- ✅ Full data export and import for portability

**Your case data never leaves your device** unless you choose to export it yourself.

---

## ♿ Accessibility

Built with WCAG 2.1 AA compliance in mind:

| Feature | Implementation |
|---------|---------------|
| **Keyboard navigation** | Full tab/enter/space/escape support throughout |
| **Screen readers** | ARIA labels, roles, live regions, and landmarks |
| **Text size** | Adjustable 0.8x–1.5x via header controls |
| **High contrast** | Toggle in header for enhanced contrast |
| **Focus indicators** | Visible focus rings on all interactive elements |
| **Skip link** | "Skip to content" for keyboard users |
| **Touch targets** | 44px minimum on all interactive elements |
| **Reduced motion** | Respects `prefers-reduced-motion` |

---

## 🗺️ Roadmap

**Completed:**
- [x] Four-section guided intake form with conditional fields
- [x] Automatic triage scoring with weighted risk factors
- [x] Auto-flags for crisis, safeguarding, and children at risk
- [x] Case dashboard with search, filters, and sortable columns
- [x] Full case lifecycle (new → triaged → assigned → in progress → closed)
- [x] Notes and timeline for each case
- [x] Structured case closure with outcome recording
- [x] Draft auto-save every 5 seconds
- [x] CSV and JSON export/import
- [x] PWA with offline support
- [x] Accessibility controls (text size, high contrast)
- [x] Deployed to Vercel

**Planned:**
- [ ] Team-based case filtering
- [ ] Reporting dashboards with charts
- [ ] Multi-language support
- [ ] PDF export of case summaries
- [ ] Caseload management views
- [ ] Audit log for case changes

---

## ❓ FAQ

**Q: Is this an official government tool?**
A: No. CaseFlow is an independent tool designed to help social services teams manage referrals. It is not affiliated with any government body.

**Q: Is my data safe?**
A: Yes. Everything is stored locally in your browser. No data is sent to any server. You can clear all data at any time from Settings.

**Q: Can multiple team members use this?**
A: Each person runs their own instance with local data. You can share cases between team members using the JSON export/import feature.

**Q: Does it work offline?**
A: Yes. After your first visit, the app is cached and works without an internet connection. Drafts are saved locally every 5 seconds.

**Q: Can I use this on my phone?**
A: Yes. It's fully responsive and works on any device. You can install it as an app from your browser menu.

**Q: How is priority calculated?**
A: The triage engine scores cases from 0–100 based on risk factors (risk to self/others, safeguarding concerns, urgency, children involved) and maps the score to a priority level with a recommended response time.

**Q: How do I clear my data?**
A: Go to Settings and click "Clear All Data", or clear site data in your browser settings.

**Q: Can I export my cases?**
A: Yes. Go to Settings to export all cases as CSV (for spreadsheets) or JSON (for backup and data portability).

---

## 🤝 Contributing

If you'd like to contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## ⚠️ Disclaimer

CaseFlow is **not** affiliated with any government department or statutory social services body. It is a free, independent tool designed to support casework workflows. The triage scores are based on configurable risk weightings and are **not** a substitute for professional clinical or safeguarding judgement. Always follow your organisation's policies and procedures for risk assessment and case management.

---

## 📄 License

MIT — use it, share it, help someone with it.

---

<p align="center">
  <i>Built because casework shouldn't mean paperwork.</i>
</p>
