<div align="center">

# SupplyLens

### Supplier Performance Intelligence Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

> **SupplyLens** is a dynamic, full-stack procurement intelligence platform that transforms raw supply chain data into real-time supplier performance dashboards, automated scorecards, and actionable risk alerts — giving procurement teams a decisive competitive edge.

<br/>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Supplier Scoring Model](#supplier-scoring-model)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SupplyLens is a **game-changing supplier performance intelligence platform** built for modern procurement teams. It ingests procurement data — purchase orders, goods receipts, and delivery records — and transforms it into a live performance intelligence layer across your entire supplier base.

Unlike generic BI tools, SupplyLens is purpose-built for supply chain operations with:

- **Automated supplier grading** using a weighted composite scoring model (OTD + Fill Rate + Quality)
- **Real-time dashboards** with interactive filtering by category, grade, and time period
- **Risk matrix visualization** to surface at-risk suppliers before they impact production
- **Automated email escalation** for Grade C/D suppliers via Formspree integration
- **Paginated vendor tables** with live search across 100+ supplier records
- **Dynamic per-page document titles** for professional browser tab management

SupplyLens redefines how procurement teams interact with supplier data — moving from monthly review cycles to continuous, data-driven monitoring.

---

## Key Features

| Feature | Description |
|---|---|
| **Analytics Dashboard** | 8 interactive Recharts visualizations — bar, line, pie/donut, scatter, and trend charts |
| **Vendor Performance Table** | Paginated supplier list (15/page) with grade badges, trend indicators, and OTD/fill rate metrics |
| **Supplier Scorecards** | Per-supplier performance breakdowns with weekly trend sparklines and alert banners |
| **Grade-Based Alerts** | Automatic C/D grade detection with pulsing risk indicators and email escalation modal |
| **Email Escalation** | Formspree-powered email notifications with pre-filled supplier context and professional modal UI |
| **Data Upload** | CSV/Excel procurement data ingestion with automated metric computation |
| **CSV Export** | One-click export of filtered supplier analytics to CSV |
| **Procurement Risk Scoring** | Composite scoring engine: `0.40 × OTD + 0.30 × Fill Rate + 0.30 × Quality Performance` |
| **Dynamic Filters** | Filter analytics by category, grade tier, and time period with instant re-render |
| **Responsive Design** | Fully responsive across desktop, tablet, and mobile viewports |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | Component-based UI framework |
| **TypeScript** | 5.x | Static typing and type safety |
| **Vite** | 5.x | Lightning-fast build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible, headless UI component library |
| **Recharts** | 2.x | Composable charting library for React |
| **React Router v6** | 6.x | Client-side routing and navigation |
| **Sonner** | Latest | Toast notification system |
| **Lucide React** | Latest | SVG icon library |
| **IBM Plex Sans / Mono** | — | Professional typefaces via Google Fonts |

### Backend & Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20.x | Server-side JavaScript runtime |
| **Express.js** | 4.x | RESTful API framework for supplier data endpoints |
| **MongoDB** | 7.x | NoSQL database for supplier records, PO history, and analytics |
| **Mongoose** | 8.x | MongoDB ODM for schema validation and query building |
| **JWT (jsonwebtoken)** | Latest | Stateless authentication and session management |
| **Bcrypt.js** | Latest | Secure password hashing |
| **Multer** | Latest | Multipart file upload handling for CSV/Excel ingestion |
| **XLSX (SheetJS)** | Latest | Server-side Excel/CSV parsing and data normalization |
| **Cors** | Latest | Cross-Origin Resource Sharing middleware |
| **Dotenv** | Latest | Environment variable management |

### DevOps & Tooling

| Technology | Purpose |
|---|---|
| **ESLint** | Code linting and style enforcement |
| **Formspree** | Frontend email delivery for supplier escalations |
| **Git + GitHub** | Version control and collaborative development |
| **Vercel / Render** | Cloud deployment for frontend and backend services |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SupplyLens Platform                       │
├──────────────────────────┬──────────────────────────────────────┤
│       React Frontend     │          Node.js / Express API        │
│  ─────────────────────   │  ───────────────────────────────────  │
│  • Vite + TypeScript     │  • REST endpoints (/api/suppliers)    │
│  • Tailwind + shadcn/ui  │  • JWT Authentication middleware      │
│  • Recharts Dashboards   │  • Multer file upload handler         │
│  • React Router v6       │  • XLSX data parser + normalizer      │
│  • Formspree Alerts      │  • Composite score computation        │
│                          │                                       │
│                          │         MongoDB Atlas                 │
│                          │  ───────────────────────────────────  │
│                          │  • suppliers collection               │
│                          │  • purchase_orders collection         │
│                          │  • users collection                   │
│                          │  • analytics_snapshots collection     │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (bundled with Node.js)
- **MongoDB** local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier
- **Git** — [Download](https://git-scm.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/supply-lens-insights.git
cd supply-lens-insights
```

**2. Install frontend dependencies**

```bash
npm install
```

**3. Install backend dependencies**

```bash
cd server
npm install
cd ..
```

**4. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

**5. Start the development server**

```bash
# Frontend (Vite dev server at http://localhost:5173)
npm run dev

# Backend API (Express server at http://localhost:5000)
cd server && npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Frontend
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id

# Backend
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/supplylens
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PORT=5000

# Optional
NODE_ENV=development
```

> **Never commit `.env` to version control.** The `.gitignore` already excludes it.

---

## Project Structure

```
supply-lens-insights/
├── public/
│   └── favicon.svg                  # SupplyLens brand icon
├── src/
│   ├── assets/
│   │   └── hero-illustration.svg    # Hero section illustration
│   ├── components/
│   │   ├── ui/                      # shadcn/ui base components
│   │   ├── AppLayout.tsx            # Shared layout wrapper
│   │   ├── GradeBadge.tsx           # A/B/C/D grade badge component
│   │   └── TrendIndicator.tsx       # Improving/Degrading trend chip
│   ├── hooks/
│   │   └── useDocumentTitle.ts      # Dynamic browser tab title hook
│   ├── lib/
│   │   └── supplierData.ts          # 100-entry supplier dataset + scoring logic
│   ├── pages/
│   │   ├── Index.tsx                # Landing page with animated UserMenu
│   │   ├── Dashboard.tsx            # Analytics dashboard (8 charts)
│   │   ├── Suppliers.tsx            # Paginated vendor performance table
│   │   ├── SupplierScorecard.tsx    # Per-supplier scorecard + email alert
│   │   ├── Upload.tsx               # Data upload page
│   │   ├── Metrics.tsx              # Evaluation metrics configuration
│   │   └── NotFound.tsx             # 404 page
│   ├── App.tsx                      # Route definitions
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles + CSS design tokens
├── server/                          # Express.js API (Node.js backend)
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API route handlers
│   ├── middleware/                   # Auth + validation middleware
│   └── index.js                     # Express server entry point
├── index.html                       # HTML entry point
├── tailwind.config.ts               # Tailwind configuration
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

---

## Supplier Scoring Model

SupplyLens uses a weighted composite scoring formula to grade suppliers objectively:

```
Composite Score = (0.40 × On-Time Delivery %)
               + (0.30 × Fill Rate %)
               + (0.30 × Quality Performance %)

Quality Performance = 100 - Rejection Rate %
```

### Grade Thresholds

| Grade | Score Range | Classification | Action |
|---|---|---|---|
| **A** | 95 – 100 | Strategic Partner | Maintain & reward |
| **B** | 85 – 94 | Reliable Supplier | Monitor quarterly |
| **C** | 70 – 84 | Needs Intervention | Escalate & audit |
| **D** | < 70 | Critical Risk | Replace / suspend |

Scores are recalculated dynamically as new procurement data is ingested.

---

## API Reference

The Express.js backend exposes the following RESTful endpoints:

```
GET    /api/suppliers              → List all suppliers (paginated)
GET    /api/suppliers/:id          → Get supplier scorecard by ID
POST   /api/suppliers              → Create / import supplier records
PUT    /api/suppliers/:id          → Update supplier data
DELETE /api/suppliers/:id          → Remove supplier record

POST   /api/upload                 → Upload CSV/Excel for batch import
GET    /api/analytics/summary      → Aggregated KPI summary
GET    /api/analytics/trends       → Weekly performance trend data

POST   /api/auth/register          → Register new user
POST   /api/auth/login             → Login and receive JWT token
GET    /api/auth/me                → Get authenticated user profile
```

All protected routes require the `Authorization: Bearer <token>` header.

---

## Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy the /dist folder to Vercel, Netlify, or any static host
```

### Backend (Render / Railway)

```bash
cd server
npm start
# Point your Render/Railway service to server/index.js
```

### Environment Setup

Set all environment variables from the [Environment Variables](#environment-variables) section in your cloud provider's dashboard before deploying.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature description"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**SupplyLens** — Turning procurement data into supplier intelligence.

*Built with precision. Designed for scale.*

</div>
