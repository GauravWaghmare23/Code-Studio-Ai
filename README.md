# Code Studio AI

## 🚀 Project Overview

Code Studio AI is a full-stack collaborative coding platform built with React + Vite frontend and Express + MongoDB backend. It supports:

- Secure user authentication (register/login/logout/profile)
- JWT-based protected API routes
- Project creation and team management
- Real-time project chat collaboration over Socket.IO
- Role-based shareable projects with add/remove collaborators
- Rate limiting, security middleware, and production-ready best practices

This README contains detailed instructions, architecture, API endpoints, and quick troubleshooting.

---

## 🧭 Tech Stack

### Frontend (client/)
- React 19
- Vite
- Tailwind CSS (via @tailwindcss/vite)
- React Router DOM v7
- Axios for API requests
- Socket.IO client for real-time collaboration

### Backend (server/)
- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JWT authentication
- Socket.IO for real-time project messaging
- bcrypt password hashing
- express-validator for input validation
- express-rate-limit + helmet + cors
- cookie-parser

---

## 📁 Repository Layout

```
.
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── config/axios.js
│   │   ├── config/socket.js
│   │   ├── context/UserContext.jsx
│   │   ├── context/ProtectedRoute.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/Home.jsx
│   │   └── pages/Project.jsx
│   └── package.json
├── server/
│   ├── app.js
│   ├── server.js
│   ├── config/dbConnect.js
│   ├── config/rateLimiter.js
│   ├── controllers/user.controller.js
│   ├── controllers/project.controller.js
│   ├── middlewares/auth.middleware.js
│   ├── middlewares/errorHandler.middleware.js
│   ├── models/user.model.js
│   ├── models/project.model.js
│   ├── routes/user.route.js
│   ├── routes/project.routes.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start (Local)

### Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn)
- MongoDB connection string (local or Atlas)

### 1) Backend Setup

```bash
cd server
npm install
```

Create `.env` in `server/`:

```dotenv
PORT=4000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=supersecretjwtkey
COOKIE_SECRET=yourcookiesecret
```

Start backend:

```bash
npm run dev
```

### 2) Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### 3) Open App

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

---

## 🔐 Authentication Flow

1. User registers using `POST /users/register`.
2. User logs in via `POST /users/login` (returns JWT in secure signed cookie).
3. Frontend calls protected routes with cookie (and optionally token header).
4. `authenticateJWT` middleware validates token and attaches user to request.
5. `GET /users/profile` returns current user profile.
6. User logs out via `GET /users/logout` (cookie cleared).

---

## 📦 API Reference

### User Endpoints

- `POST /users/register`
  - Body: `{ email, password, name? }`
  - Validates email/password length.
  - Creates user; returns success data.

- `POST /users/login`
  - Body: `{ email, password }`
  - Returns JWT cookie on success.

- `GET /users/profile`
  - Protected.
  - Returns user profile data.

- `GET /users/logout`
  - Protected.
  - Clears cookie and revokes session.

- `GET /users/all`
  - Protected.
  - Returns all users (for project collaborator picks).

### Project Endpoints

- `POST /projects/create`
  - Protected.
  - Body: `{ name }`
  - Creates a new project owned by the authenticated user.

- `GET /projects/list`
  - Protected.
  - Lists projects the user owns or is assigned to.

- `GET /projects/get-project/:projectId`
  - Protected.
  - Fetches details by project ID.

- `PUT /projects/add-users`
  - Protected.
  - Body: `{ projectId, users: [userId...] }`
  - Adds collaborators to project.

- `PUT /projects/remove-user`
  - Protected.
  - Body: `{ projectId, userId }`
  - Removes a collaborator.

- `DELETE /projects/delete/:projectId`
  - Protected.
  - Deletes project by ID (owner-level action).

---

## 🔄 Real-Time Collaboration (Socket.IO)

The backend has Socket.IO configured in `server/server.js`:

- Socket auth uses JWT token + `projectId` query.
- User joins room for `socket.project._id`.
- Clients send `project-message` events and receive broadcast messages to room.

Client side config is in `client/src/config/socket.js`.

> Example: `io(BASE_URL, { auth: { token }, query: { projectId } })`

---

## 🧠 Frontend Behavior

`client/src/App.jsx`:
- On mount, checks `/users/profile` via Axios.
- If user is undefined, shows loading screen.
- If user exists, routes to app pages.

`client/src/context/UserContext.jsx`:
- Provides `user`, `setUser` across app.

`client/src/routes/AppRoutes.jsx`:
- Contains public routes: `/login`, `/register`.
- Contains protected route wrapper for main app pages.

`client/src/pages/Project.jsx`:
- Loads project details + members.
- Connects to Socket.IO room for project chat.
- Allows sending messages and collaborator updates.

---

## 🧪 Code Quality

- `client` has ESLint setup. Run `npm run lint` in client to validate.
- Express request validation uses `express-validator` for request safety.
- Rate limiting in `server/config/rateLimiter.js` protects authentication and general endpoints.
- Centralized error middleware in `server/middlewares/errorHandler.middleware.js`.

---

## 🛠️ Deployment Notes

### Production build steps

1. Build frontend:

```bash
cd client
npm run build
```

2. Serve static files from backend (optional): copy `client/dist` to server static path and configure express static.

3. Set environment variables securely in deployment environment:

- `MONGO_URI`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `PORT`

4. Start backend:

```bash
cd server
npm start
```

### Recommended hosts

- Backend: Render, Railway, Heroku, Azure App Service, DigitalOcean App Platform
- Frontend: Vercel, Netlify, or static host (if served separately)

---

## 🧭 Troubleshooting

### CORS/credentials failed

- Ensure frontend origin is whitelisted in backend `allowedOrigins`.
- server uses `credentials: true`; frontend must send credentials in Axios with `withCredentials: true`.

### `JWT malformed` or `Authentication error` in socket

- Confirm token in socket handshake is valid and `projectId` exists.
- Check `.env` secret values match deployment secrets.

### MongoDB connection fails

- Validate `MONGO_URI` and network access (Atlas IP allowlist or local service running).

### “Project ID is required” from socket

- Ensure socket connects with query `projectId` exactly and project exists.

---

## ✅ Common UX Workflow

1. Register user.
2. Login.
3. Create a project.
4. Add teammates using user IDs.
5. Open project page and send real-time chat messages.
6. Team members join and collaborate in the same room.

---

## 🔧 Extending This Project

### Add roles and permissions
- Add `role` field to user model (`owner`, `admin`, `member`)
- Enforce role checks in `project.controller` actions for create/delete/add/remove

### Add project tasks
- Create `Task` subdocument in project schema
- Add endpoints for task CRUD and real-time task events

### Add code editor collaboration
- Integrate Monaco Editor or CodeMirror
- Use Socket.IO events for shared content updates and cursor positions

---

## 🧾 Attributions

Built as a collaboration project combining modern React + Node.js best practices.

---

## 📌 Reference Files

- Backend entry: `server/server.js`
- Express app: `server/app.js`
- API routes: `server/routes/user.route.js`, `server/routes/project.routes.js`
- Auth middleware: `server/middlewares/auth.middleware.js`
- Project model: `server/models/project.model.js`
- Frontend entry: `client/src/main.jsx`
- Frontend routes: `client/src/routes/AppRoutes.jsx`

---

## ❤️ Contributing

1. Fork repository
2. Create feature branch
3. Add tests if applicable
4. Open PR with summary and testing steps

---

## 📞 Need help?

If you need help adapting data models, adding new routes, or deploying to your cloud provider, open an issue and include logs from backend and frontend.

---

*This README is intentionally detailed for onboarding new developers and keeping the full stack setup consistent.*
