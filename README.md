# CaseFlow

CaseFlow is a free, offline-capable web application designed to streamline client intake and triage for social services teams. The tool replaces paper and spreadsheet workflows with a structured referral system that automatically assesses risk and prioritises cases.

## Core Purpose

The application captures client referrals through a guided multi-step form, runs automatic risk-based triage scoring, and provides a dashboard for teams to track cases from intake through to resolution — all while keeping data entirely on the user's device.

## Main Features

- **Guided Intake Form**: Four-section referral form covering client details, referral information, risk assessment, and consent with real-time validation and conditional fields
- **Automatic Triage**: Risk-based scoring engine that calculates priority (Low/Medium/High/Urgent) with weighted factors including risk to self, safeguarding concerns, and urgency
- **Case Dashboard**: Tabbed inbox with search, priority filters, date range filtering, sortable columns, and quick-assign functionality
- **Case Management**: Detailed case view with notes, timeline, status transitions, and structured case closure with outcome recording
- **Draft Auto-Save**: Unfinished referrals are saved every 5 seconds and can be resumed on return
- **Offline Functionality**: Works as a Progressive Web App (PWA) after initial visit
- **Data Export**: Export all cases to CSV or JSON for reporting and analysis, with JSON import for data portability
- **Accessibility**: High contrast mode, adjustable text sizing (0.8x–1.5x), full keyboard navigation, screen reader support, and 44px minimum touch targets

## Technical Implementation

Built with React 19 and TypeScript, styled with Tailwind CSS 3, and bundled with Vite 6. State management uses React Context with useReducer. The form system is data-driven — field definitions, validation rules, and conditional visibility are all configured declaratively. The triage engine is implemented as pure functions with configurable scoring weights. Workbox handles service worker generation for offline support.

## Privacy Assurance

Everything stays on your device — no backend servers, no databases, no tracking. All case data persists through localStorage and the application functions completely offline after the first visit. Users control their data with full export and clear capabilities.

## Triage Scoring

The scoring system evaluates referrals across multiple risk dimensions (risk to self, risk to others, risk from others, safeguarding, urgency, children involved) and assigns a priority level:

- **Low** (0–20): Standard response within 5 working days
- **Medium** (21–40): Response within 3 working days
- **High** (41–60): Response within 24 hours
- **Urgent** (61–100): Immediate response required

Auto-flags are raised for crisis situations, safeguarding concerns, children at risk, and cases requiring immediate intervention.

## Current Status

The application is fully functional with all core features implemented. The dark-themed interface is designed for extended use in office environments. Future enhancements could include team-based filtering, reporting dashboards, and multi-language support.
