# Job Application Tracker

Production-style MERN app for managing a job search pipeline from saved role to offer, rejection, or hold. The app includes authentication, protected user data, advanced filters, dashboard analytics, Kanban status movement, reminders, activity timelines, CSV export, and seeded demo data.

## Tech Stack

- Frontend: React, Vite, React Router, Recharts, React Hot Toast, Lucide icons, custom responsive CSS
- Backend: Node.js, Express, JWT, bcrypt, Mongoose, MongoDB
- Product features: Kanban board, analytics, profile management, follow-up alerts, interview notes, task checklists, CSV export, demo login, quick job-description extraction

## Features

- JWT signup, login, logout, protected routes, password hashing, profile editing
- Full job application CRUD with detailed role, company, recruiter, salary, source, resume, notes, tags, and follow-up fields
- Realistic pipeline statuses: Saved, Applied, OA / Assessment, Interview Scheduled, Interviewing, HR Round, Final Round, Offer, Rejected, On Hold
- Dashboard cards for total applications, offers, rejections, interview pipeline, follow-ups, monthly applications, and recent activity
- Analytics for monthly application trend, status distribution, source breakdown, and offer/rejection ratio
- Search, status/source/priority/date filters, sorting, pagination, and clear filters
- Kanban board with drag-and-drop status updates
- Interview notes, task checklist, follow-up alerts, overdue highlighting, and activity feed
- CSV export of applications
- Demo account and seed data for reviewers

## Quick Start

```bash
npm install
cp server/.env.example server/.env
docker compose up -d mongo
npm run seed
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:5001`.

Demo reviewer account:

```text
Email: demo@jobtrack.dev
Password: DemoPass123!
```

## Environment

Create `server/.env`:

```bash
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/jobtrackr
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Optional `client/.env`:

```bash
VITE_API_URL=http://localhost:5001/api
```

## Seed Data

The seed script creates the reviewer account and realistic applications across companies such as Atlassian, Razorpay, Swiggy, CRED, Freshworks, Zerodha, Postman, and Groww. Seed records include statuses, salary ranges, recruiter details, interview notes, task checklists, resume versions, cover-letter usage, tags, overdue follow-ups, and an offer/rejection mix.

## Folder Structure

```text
client/
  src/
    components/      Reusable layout, cards, forms, badges, filters, pagination
    context/         Auth context and theme state
    hooks/           Data-fetching hooks
    pages/           Dashboard, applications, detail, board, analytics, profile, auth
    services/        Axios API client
    styles/          Global responsive styles
    utils/           Constants and formatters
server/
  src/
    config/          MongoDB connection
    controllers/     Auth, user, application, analytics controllers
    middleware/      Auth, validation, error handling
    models/          User, Application, Activity schemas
    routes/          REST route modules
    seed/            Demo seed script
    utils/           Async/error helpers and demo data
```

## Page Structure

- `/login` and `/register`: authentication screens with demo login
- `/`: dashboard overview and follow-up alerts
- `/applications`: searchable, filterable, paginated application list
- `/applications/new`: create application with quick extraction from pasted job description
- `/applications/:id`: detailed application profile, interview notes, tasks, timeline
- `/applications/:id/edit`: edit application
- `/board`: drag-and-drop Kanban board
- `/analytics`: charts and deeper metrics
- `/profile`: user profile and preferences

## API Routes

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/demo`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Profile:

- `GET /api/users/profile`
- `PATCH /api/users/profile`

Applications:

- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/export/csv`
- `POST /api/applications/extract`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`
- `POST /api/applications/:id/notes`
- `POST /api/applications/:id/tasks`
- `PATCH /api/applications/:id/tasks/:taskId`
- `POST /api/applications/:id/reminder/mock`

Analytics:

- `GET /api/analytics/summary`
- `GET /api/analytics/trends`

## MongoDB Schema Highlights

- `User`: identity, secure password hash, profile fields, target roles, preferred locations, portfolio/GitHub/LinkedIn links
- `Application`: user-owned job record with source, salary, status, priority, dates, recruiter details, tags, resume tracking, notes, interview rounds, checklist tasks, and timestamps
- `Activity`: normalized feed for create/update/status/note/task/reminder/profile events

## Reusable Components

- `Layout`, `ProtectedRoute`, `StatCard`, `StatusBadge`, `PriorityBadge`
- `ApplicationForm`, `ApplicationCard`, `FilterBar`, `Pagination`
- `EmptyState`, `LoadingSkeleton`, `ConfirmDialog`
- Chart cards using Recharts primitives

## Phased Development Plan

Phase 1: Foundation

- Backend models, auth, protected routes, CRUD, validation, error middleware
- React routing, auth context, dashboard shell, application list/detail/create/edit
- Seed data and demo account

Phase 2: Product Depth

- Dashboard metrics, filters, pagination, follow-up alerts, notes, tasks
- Analytics charts, CSV export, profile page, dark mode, toasts, empty/loading states
- Kanban drag-and-drop status updates

Phase 3: Standout Polish

- Job-description extraction workflow
- Mock reminder activity, interview round history, richer activity timeline
- Shareable read-only board, real email reminders, resume uploads, browser extension/bookmarklet quick add

## Build First vs Later

Build first:

- Auth, user ownership, application CRUD, dashboard, filters, seed data
- Follow-up alerts and status analytics because they make the app feel useful immediately

Build later:

- Resume file uploads, real email reminders, shareable public board, browser extension/bookmarklet
- AI-assisted job parsing after the core workflow is solid

## Resume Bullet Points

- Built a full-stack MERN job-search CRM with JWT auth, protected multi-user data, Mongoose schemas, and RESTful Express APIs.
- Implemented advanced search, filtering, sorting, pagination, CSV export, and analytics aggregations over MongoDB application data.
- Designed a polished responsive React UI with dashboard cards, Recharts visualizations, Kanban drag-and-drop, dark mode, toasts, and accessible forms.
- Added real-world workflow features including follow-up alerts, recruiter details, interview notes, task checklists, activity timelines, resume-version tracking, and demo seed data.

## Screenshots

Add screenshots of:

- Dashboard overview
- Applications list with filters
- Application detail timeline
- Kanban board
- Analytics charts

## Future Improvements

- Real email/calendar reminders
- Resume upload with cloud storage
- Browser bookmarklet or extension for quick-add from job posts
- Public read-only board sharing
- AI-based job post parsing and match scoring
