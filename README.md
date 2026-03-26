<div align="center">

# SupplyLens

### Supplier Performance Intelligence Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?style=flat-square&logo=python)](https://www.python.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

> **SupplyLens** is a full-stack procurement intelligence platform that transforms raw supply chain data into real-time supplier performance dashboards, automated scorecards, and actionable risk alerts — enabling procurement teams to make data-driven decisions and optimize supplier relationships.

<br/>

[**Live Demo**](#) · [**Issues**](https://github.com/your-username/supply-lens/issues) · [**Documentation](#getting-started)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supplier Scoring Model](#supplier-scoring-model)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Scripts & Commands](#scripts--commands)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SupplyLens is a **game-changing supplier performance intelligence platform** purpose-built for modern procurement teams. It ingests procurement data — purchase orders, goods receipts, and delivery records — and transforms it into a live performance intelligence layer across your entire supplier base.

### Problem It Solves

Procurement teams struggle with:
- **Manual data silos** — supplier metrics scattered across spreadsheets and ERPs
- **Slow decision cycles** — monthly reviews instead of real-time visibility
- **Risk blindness** — only discovering underperforming suppliers after problems escalate
- **Lack of accountability** — no objective supplier grading framework

### Why SupplyLens?

- ✅ **Automated supplier grading** using a weighted composite scoring model (OTD + Fill Rate + Quality)
- ✅ **Real-time dashboards** with interactive filtering by category, grade, and time period
- ✅ **Risk matrix visualization** to surface at-risk suppliers before they impact production
- ✅ **Email escalation** for Grade C/D suppliers with audit trails
- ✅ **Bulk data ingestion** — upload CSV/Excel files with automatic metric computation
- ✅ **Professional UI** — fully responsive across desktop, tablet, and mobile

### Target Users

- **Procurement Directors** — strategic supplier performance oversight
- **Procurement Managers** — daily vendor performance monitoring
- **Supply Chain Analysts** — data-driven supplier evaluation
- **Operations Teams** — real-time supplier risk alerts

---

## Key Features

| Feature | Description |
|---|---|
| **Analytics Dashboard** | 8 interactive Recharts visualizations — bar, line, pie/donut, scatter, and performance trend charts |
| **Vendor Performance Table** | Paginated supplier list (15/page) with grade badges, trend indicators, and OTD/fill rate metrics |
| **Supplier Scorecards** | Per-supplier performance breakdowns with weekly trend sparklines and alert banners |
| **Grade-Based Alerts** | Automatic C/D grade detection with pulsing risk indicators and email escalation modal |
| **Email Escalation** | FastAPI-mail (Brevo) powered email notifications with pre-filled supplier context |
| **Data Upload** | CSV/Excel procurement data ingestion with automated metric computation |
| **CSV Export** | One-click export of filtered supplier analytics to CSV |
| **Procurement Risk Scoring** | Composite scoring engine: `0.40 × OTD + 0.30 × Fill Rate + 0.30 × Quality Performance` |
| **Dynamic Filters** | Filter analytics by category, grade tier, and time period with instant re-render |
| **Authentication** | Clerk-powered SSO with JWT token-based API security |
| **Responsive Design** | Fully responsive across desktop, tablet, and mobile viewports |
| **API Documentation** | Auto-generated Swagger UI at `/docs` and ReDoc at `/redoc` |

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
| **React Query** | 5.x | Server state management and data fetching |
| **Clerk Auth** | Latest | Enterprise SSO and authentication |
| **Sonner** | Latest | Toast notification system |
| **Lucide React** | Latest | SVG icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.11+ | High-level server-side language |
| **FastAPI** | 0.115 | Modern async REST API framework |
| **SQLAlchemy** | 2.0 | ORM for database abstraction and queries |
| **Uvicorn** | 0.30 | ASGI server for async request handling |
| **Pydantic** | 2.12 | Data validation and serialization |
| **PyMySQL** | 1.1 | MySQL database driver |
| **Alembic** | 1.13 | Database migration management |
| **FastAPI-Mail** | 1.6 | Email delivery (via Brevo SMTP) |
| **python-jose** | 3.3 | JWT token creation and verification |
| **Passlib + Bcrypt** | Latest | Password hashing and verification |
| **Pandas** | 2.2 | Data processing and transformation |
| **openpyxl** | 3.1 | Excel/CSV file parsing |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| **MySQL** | Relational database for supplier and transaction records |
| **Clerk** | Enterprise authentication and user management |
| **Brevo** | SMTP provider for automated email escalations |
| **Git + GitHub** | Version control and collaboration |
| **Docker** | Containerization for consistent deployment |
| **SQL Alembic** | Database schema versioning and migrations |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                       SupplyLens Platform                              │
├────────────────────────────┬─────────────────────────────────────────┤
│     React Frontend         │      FastAPI Backend                    │
│  ───────────────────       │  ──────────────────────                 │
│  • Vite + TypeScript       │  • RESTful API (Async I/O)             │
│  • Tailwind + shadcn/ui    │  • JWT + Clerk authentication          │
│  • Recharts Dashboards     │  • SQLAlchemy ORM                      │
│  • React Router v6         │  • Alembic migrations                  │
│  • Clerk SSO               │  • FastAPI-Mail (Brevo)                │
│  • React Query             │  • Pandas data processing              │
│                            │                                        │
│:5173 (dev) / Vercel (prod) │  :8000 (dev) / Render/Railway (prod) │
│                            │                                        │
│                   ┌────────┴────────────────┐                       │
│                   │   MySQL Database       │                       │
│                   │  (Aiven / AWS RDS)     │                       │
│                   │  ───────────────────   │                       │
│                   │  • suppliers table     │                       │
│                   │  • purchase_orders     │                       │
│                   │  • users table         │                       │
│                   │  • audit_logs table    │                       │
│                   └────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
SupplyLens/
├── Frontend/                        # React + TypeScript application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero-illustration.svg
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── GradeBadge.tsx       # A/B/C/D grade badge
│   │   │   └── TrendIndicator.tsx
│   │   ├── hooks/
│   │   │   └── useDocumentTitle.ts
│   │   ├── lib/
│   │   │   ├── supplierData.ts
│   │   │   └── api.ts              # API client
│   │   ├── pages/
│   │   │   ├── Index.tsx            # Landing page
│   │   │   ├── Dashboard.tsx        # Analytics dashboard
│   │   │   ├── Suppliers.tsx        # Vendor table
│   │   │   ├── SupplierScorecard.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── Metrics.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── eslint.config.js
│   └── README.md                   # Frontend-specific documentation
│
├── Backend/                         # FastAPI + Python application
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py            # Settings & environment variables
│   │   │   └── security.py          # JWT & authentication logic
│   │   ├── models/
│   │   │   ├── supplier.py
│   │   │   ├── purchase_order.py
│   │   │   ├── user.py
│   │   │   └── audit_log.py
│   │   ├── schemas/
│   │   │   ├── supplier_schema.py   # Pydantic models
│   │   │   ├── auth_schema.py
│   │   │   └── upload_schema.py
│   │   ├── routers/
│   │   │   ├── suppliers_router.py
│   │   │   ├── metrics_router.py
│   │   │   ├── auth_router.py
│   │   │   ├── upload_router.py
│   │   │   ├── email_router.py
│   │   │   └── health_router.py
│   │   ├── middleware/
│   │   │   └── auth_middleware.py
│   │   ├── database.py              # SQLAlchemy engine & session
│   │   └── utils/
│   │       ├── scoring.py           # Composite score calculation
│   │       └── excel_parser.py      # Excel/CSV data parsing
│   ├── alembic/                     # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md                    # Backend-specific documentation
│
├── .gitignore
├── .git/
├── runtime.txt
└── README.md                        # This file (root documentation)
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (bundled with Node.js)
- **Python** v3.11 or higher — [Download](https://www.python.org)
- **pip** (Python package manager, bundled with Python)
- **Git** — [Download](https://git-scm.com)
- **MySQL** v8.0 or higher — [Local](https://dev.mysql.com/downloads/mysql/) or [Aiven Cloud](https://aiven.io)

### Quick Start

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/supply-lens.git
cd supply-lens
```

#### 2. Download Sample Datasets

The sample datasets are hosted on GitHub Releases to keep the repository lightweight.

**Option A: Automated Download (Recommended)**

On Windows (PowerShell):
```powershell
.\download-datasets.ps1
```

On Linux/Mac:
```bash
chmod +x download-datasets.sh
./download-datasets.sh
```

**Option B: Manual Download**

1. Go to the [Releases page](https://github.com/your-username/SupplyLens/releases)
2. Download the latest release assets (4 Excel files)
3. Place them in the `Dataset/` folder

**Option C: Direct Download Links**

```bash
cd Dataset/
# Download each file
curl -LO https://github.com/your-username/SupplyLens/releases/download/v1.0.0/supplier_orders_week1_new.xlsx
curl -LO https://github.com/your-username/SupplyLens/releases/download/v1.0.0/supplier_orders_week2_new.xlsx
curl -LO https://github.com/your-username/SupplyLens/releases/download/v1.0.0/supplier_orders_week3_new.xlsx
curl -LO https://github.com/your-username/SupplyLens/releases/download/v1.0.0/supplier_orders_week4_new.xlsx
```

> 📝 **Note:** For detailed dataset setup instructions, see [DATASET_SETUP.md](DATASET_SETUP.md)

#### 3. Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env.local
```

Edit `.env.local` with your Clerk credentials and API endpoints:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

#### 4. Backend Setup

```bash
cd ../Backend
python -m venv venv
```

**On Windows:**
```bash
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database and email credentials:

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/supplylens
SECRET_KEY=your-secret-key-min-64-chars
CLERK_SECRET_KEY=sk_test_...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-brevo-smtp-key
```

Run database migrations:

```bash
alembic upgrade head
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

Backend API runs at **http://localhost:8000**<br>
API Docs: **http://localhost:8000/docs** | ReDoc: **http://localhost:8000/redoc**

#### 4. Verify Everything Works

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/suppliers
- Swagger UI: http://localhost:8000/docs

---

## Environment Variables

### Frontend (.env.local)

| Variable | Description | Example |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication key | `pk_test_...` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

### Backend (.env)

#### Database

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Full database connection string | `mysql+pymysql://user:pass@localhost/supplylens` |
| `DB_HOST` | Database hostname | `localhost` or Aiven host |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `supplylens` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `DB_SSL_MODE` | SSL mode for connection | `REQUIRED` (production) |

#### Application

| Variable | Description | Example |
|---|---|---|
| `APP_ENV` | Environment mode | `development` or `production` |
| `APP_HOST` | Server host | `0.0.0.0` |
| `APP_PORT` | Server port | `8000` |
| `DEBUG` | Debug mode | `True` or `False` |

#### Security

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | JWT secret (min 64 chars) | Generate: `python -c "import secrets; print(secrets.token_hex(64))"` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiration | `7` |

#### Authentication (Clerk)

| Variable | Description | Example |
|---|---|---|
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` or `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` or `sk_live_...` |
| `CLERK_JWKS_URL` | Clerk JWKS endpoint | `https://your-domain.clerk.accounts.dev/.well-known/jwks.json` |

#### CORS

| Variable | Description | Example |
|---|---|---|
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:5173,https://app.example.com` |

#### Email (Brevo SMTP)

| Variable | Description | Example |
|---|---|---|
| `SMTP_HOST` | SMTP server host | `smtp-relay.brevo.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP login email | `your-brevo-email@example.com` |
| `SMTP_PASS` | SMTP password / API key | Your Brevo SMTP key |
| `MAIL_DEFAULT_FROM` | Default sender email | `noreply@supplylens.com` |
| `MAIL_ALERT_RECIPIENT` | Alert recipient email (optional) | Leave blank to send to uploader's email |

> **Never commit `.env` or `.env.local` files to version control.** Both are listed in `.gitignore`.

---

## Supplier Scoring Model

SupplyLens uses a weighted composite scoring formula to grade suppliers objectively and consistently.

### Formula

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

### Example

A supplier with:
- On-Time Delivery: 95%
- Fill Rate: 88%
- Rejection Rate: 5% (Quality: 95%)

**Score = (0.40 × 95) + (0.30 × 88) + (0.30 × 95) = 38 + 26.4 + 28.5 = 92.9 → Grade B**

Scores are **recalculated dynamically** as new procurement data is ingested.

---

## API Reference

### Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://api.supplylens.com` (or your deployment URL)

### Authentication

All protected endpoints require the `Authorization: Bearer <token>` header.

```bash
curl -H "Authorization: Bearer your_jwt_token" http://localhost:8000/api/suppliers
```

### Endpoints

#### Auth

```
POST   /api/auth/register              → Register new user
POST   /api/auth/login                 → Login and receive JWT token
GET    /api/auth/me                    → Get authenticated user profile
POST   /api/auth/refresh               → Refresh JWT token
```

#### Suppliers

```
GET    /api/suppliers                  → List all suppliers (paginated)
GET    /api/suppliers/{supplier_id}    → Get supplier scorecard by ID
POST   /api/suppliers                  → Create supplier record
PUT    /api/suppliers/{supplier_id}    → Update supplier data
DELETE /api/suppliers/{supplier_id}    → Remove supplier record
```

#### Analytics

```
GET    /api/metrics/summary            → Aggregated KPI summary
GET    /api/metrics/trends             → Weekly performance trend data
GET    /api/metrics/risk-matrix        → Risk matrix visualization data
```

#### Data Upload

```
POST   /api/upload/suppliers           → Upload CSV/Excel for batch import
GET    /api/upload/status/{upload_id}  → Check upload processing status
```

#### Health & Status

```
GET    /api/health                     → Service health check
GET    /api/docs                       → Swagger UI (interactive docs)
GET    /api/redoc                      → ReDoc (static API docs)
```

**See `/docs` endpoint for full interactive API documentation.**

---

## Deployment

### Frontend (Vercel)

1. **Build production bundle:**

   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy to Vercel:**

   ```bash
   npm install -g vercel
   vercel
   ```

   Or connect your GitHub repo to Vercel for automatic deployments.

3. **Environment variables in Vercel Dashboard:**

   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_API_BASE_URL=https://api.supplylens.com
   ```

### Backend (Render or Railway)

#### Option 1: Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `pip install -r requirements.txt && alembic upgrade head`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`
6. Deploy!

#### Option 2: Railway

1. Connect GitHub repository
2. Add MySQL service
3. Set environment variables
4. Deploy!

#### Database Setup (Production)

```bash
# Create database on Aiven or AWS RDS
# Set DATABASE_URL environment variable
# Run migrations:
alembic upgrade head
```

---

## Scripts & Commands

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (http://localhost:5173) |
| `npm run build` | Production build to `/dist` |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across frontend code |
| `npm run test` | Run vitest test suite |
| `npm run test:watch` | Watch mode for tests |

### Backend

| Command | Description |
|---|---|
| `uvicorn main:app --reload` | Start dev server with auto-reload |
| `uvicorn main:app --host 0.0.0.0 --port 8000` | Start production server |
| `alembic revision --autogenerate -m "description"` | Generate database migration |
| `alembic upgrade head` | Apply all pending migrations |
| `alembic downgrade -1` | Rollback last migration |
| `python seed.py` | Seed database with sample data |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

   ```bash
   gh repo fork your-username/supply-lens --clone
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes** (follow [Conventional Commits](https://www.conventionalcommits.org/))

   ```bash
   git commit -m "feat: add supplier risk notifications"
   ```

4. **Push to your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

   - Provide clear description of changes
   - Link to related issues
   - Ensure tests pass and code passes linting

### Code Style

- **Frontend:** ESLint (enforced on commit)
- **Backend:** PEP 8 (Python style guide)
- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/)

### Reporting Issues

Found a bug? [Open an issue](https://github.com/your-username/supply-lens/issues) with:
- Clear description of the problem
- Steps to reproduce
- Screenshots (if applicable)
- Your environment (OS, browser, Python/Node version)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

**SupplyLens** is built with world-class open-source technologies:

- [FastAPI](https://fastapi.tiangolo.com) — Modern async Python web framework
- [React](https://reactjs.org) — JavaScript UI library
- [SQLAlchemy](https://www.sqlalchemy.org) — Python ORM
- [Clerk](https://clerk.com) — Enterprise authentication
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) — Accessible component library
- [Recharts](https://recharts.org) — React charting library
- [Pydantic](https://docs.pydantic.dev) — Data validation

---

<div align="center">

**SupplyLens** — Transforming Procurement Data into Supplier Intelligence

*Built with precision. Designed for scale. Open-source at heart.*

[⬆ Back to Top](#supplylens)

</div>
