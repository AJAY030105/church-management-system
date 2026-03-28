# ✝ Sacred Heart — Church Management System

A full-stack Church Management System built with React, Node.js, Express, MongoDB, and JWT authentication.

---

## 🗂 Project Structure

```
church-management-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── notificationController.js
│   │   └── quizController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Notification.js
│   │   ├── Quiz.js
│   │   └── Score.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── quizRoutes.js
│   ├── utils/sendEmail.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── NotificationBell.jsx
    │   │   └── QuizCard.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Parish.jsx
    │   │   ├── Events.jsx
    │   │   ├── Services.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── LearningHub.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Login.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

---

## 🚀 Setup & Installation

### 1. Clone / unzip the project

```bash
cd church-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/church_management
JWT_SECRET=your_super_secret_jwt_key_change_this
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

Start backend:

```bash
npm run dev     # development (with nodemon)
npm start       # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Creating an Admin Account

1. Register a new account at `/login`
2. Open MongoDB shell or Compass:

```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

3. Log out and log back in — you'll see "Admin Dashboard" in the profile menu.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | JWT | Get current user |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | No | Get all events |
| GET | `/api/events/:id` | No | Get single event |
| POST | `/api/events` | Admin | Create event (auto-notifies) |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |

### Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | JWT | Get all notifications |
| POST | `/api/notifications` | Admin | Create notification |
| PUT | `/api/notifications/read-all` | JWT | Mark all read |
| PUT | `/api/notifications/:id/read` | JWT | Mark one read |

### Quiz
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quiz/questions` | No | Get questions |
| POST | `/api/quiz/questions` | Admin | Add question |
| DELETE | `/api/quiz/questions/:id` | Admin | Delete question |
| POST | `/api/quiz/submit` | JWT | Submit answers |
| GET | `/api/quiz/scores/me` | JWT | My score history |
| GET | `/api/quiz/scores/all` | Admin | All scores |

---

## ✨ Features

- **JWT Authentication** — Register, Login, protected routes
- **Admin Dashboard** — Full CRUD for events, quiz questions; view all scores
- **Event Management** — Create/edit/delete events with categories
- **Auto Notifications** — Creating an event auto-creates a notification AND sends email to all users via Nodemailer
- **Notification Bell** — Real-time polling (30s), mark as read, unread count badge
- **Quiz System** — One-question-at-a-time, progress bar, scoring, grade result, history
- **Responsive UI** — Mobile-first, works on all screen sizes
- **8 Pages** — Home, About, Parish, Events, Services, Gallery, Learning Hub, Contact

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail) |
| Styling | Custom CSS (no framework) |
| Fonts | Cormorant Garamond + Montserrat |

---

## 📝 Notes

- The Vite dev server proxies `/api` requests to `localhost:5000` automatically
- Email sending failures are non-blocking (events still save if email fails)
- Gallery uses placeholder emoji tiles — replace with real images via `event.image` URLs
- For production, set `FRONTEND_URL` in `.env` to your deployed frontend URL and configure CORS accordingly
