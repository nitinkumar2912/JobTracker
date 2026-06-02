# 🚀 JobTrackr – MERN Job Application Tracker

A production-ready full-stack MERN application that helps job seekers organize, track, and optimize their job search pipeline from application to offer.

🔗 Live Demo: https://job-tracker-client-murex.vercel.app

🔗 GitHub Repository: https://github.com/nitinkumar2912/JobTracker

---

## ✨ Features

### 🔐 Authentication & Security
- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes
- User-specific Data Isolation
- Persistent Login Sessions

### 📋 Application Management
- Create, Edit, Delete Applications
- Track Application Status
- Recruiter Information
- Salary Tracking
- Resume Version Tracking
- Cover Letter Tracking
- Notes & Follow-ups

### 📊 Analytics Dashboard
- Application Trends
- Status Distribution
- Offer vs Rejection Metrics
- Source Analysis
- Monthly Application Insights

### 🎯 Kanban Board
- Drag & Drop Workflow
- Visual Status Management
- Pipeline Tracking

### ⏰ Productivity Tools
- Follow-up Reminders
- Interview Notes
- Task Checklists
- Activity Timeline
- Priority Labels

### 📁 Data Export
- CSV Export Support
- Search & Filtering
- Advanced Sorting
- Pagination

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Recharts
- React Hot Toast
- Lucide Icons
- Custom Responsive CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Mongoose

### Database
- MongoDB Atlas

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🌐 Live Application

### Frontend
https://job-tracker-client-murex.vercel.app

### Backend API
https://jobtracker-t8ui.onrender.com

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Applications
![Applications](screenshots/applications.png)

### Kanban Board
![Board](screenshots/board.png)

### Analytics
![Analytics](screenshots/analytics.png)

### Application Details
![Details](screenshots/details.png)

---

## 🏗 Architecture

```text
React + Vite
      │
      ▼
Express.js API
      │
      ▼
MongoDB Atlas
```

---

## 📂 Project Structure

```text
JobTracker
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── utils
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── seed
│   │   └── utils
│
└── README.md
```

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/nitinkumar2912/JobTracker.git
cd JobTracker
```

### Install Dependencies

```bash
npm install
```

### Setup Environment Variables

Create:

```bash
server/.env
```

Add:

```env
PORT=5001
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Optional:

```bash
client/.env
```

```env
VITE_API_URL=http://localhost:5001/api
```

### Start Project

```bash
npm run dev
```

---

## 📊 Core Features Implemented

- Authentication System
- Dashboard Analytics
- Application CRUD
- Activity Timeline
- Follow-up Reminders
- Kanban Workflow
- CSV Export
- Interview Tracking
- Recruiter Management
- User Profile Management

---

## 🎯 Resume Highlights

- Built and deployed a full-stack MERN Job Tracking Platform.
- Implemented JWT-based authentication and protected APIs.
- Designed analytics dashboards using Recharts.
- Integrated MongoDB Atlas, Render, and Vercel deployment pipelines.
- Developed Kanban workflow and productivity tools for job seekers.

---

## 🔮 Future Improvements

- Email Notifications
- Calendar Integration
- Resume Uploads
- Browser Extension
- AI-powered Job Parsing
- AI Match Scoring
- Public Shareable Boards

---

## 👨‍💻 Author

**Nitin Ahlawat**

- GitHub: https://github.com/nitinkumar2912
- Portfolio: https://nitinkumar2912.github.io/portfolio/

---

⭐ If you found this project useful, consider giving it a star.
