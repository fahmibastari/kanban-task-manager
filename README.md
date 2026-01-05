# Kanban Task Manager

A professional, secure, and full-stack task management system designed with clean architecture and strict data isolation.

## Project Identity

**Kanban Task Manager** is a robust application that allows users to manage projects and tasks using an interactive Kanban board. Key engineering priorities for this project were **security**, **strict typing**, and **modular architecture**.

Unlike simple todo apps, this system implements **HTTP-Only Cookie Authentication** (preventing XSS attacks by making tokens inaccessible to JavaScript) and **Strict Data Isolation** (ensuring users can never access or modify data belonging to others).

---

## Tech Stack

### Backend
- **Framework**: **NestJS** (Modular, Scalable Node.js Framework)
- **Database**: **SQLite** with **Prisma ORM**
- **Authentication**: **Passport.js** + **JWT** (HTTP-Only Cookies)
- **Validation**: `class-validator` & `class-transformer` (Strict DTOs)

### Frontend
- **Framework**: **Next.js 15** (App Router)
- **Styling**: **Tailwind CSS** + **Shadcn/UI** (Radix Primitives)
- **State Management**: React Context (Auth) + Local State
- **Libraries**:
  - `@hello-pangea/dnd` (Accessible Drag-and-Drop)
  - `axios` (HTTP Client with Credentials)

---

## Project Highlights

### 🔒 HTTP-Only Cookie Authentication
Instead of storing JWTs in `localStorage` (where they are vulnerable to XSS), this application uses **HTTP-Only Cookies**. The backend sets the cookie upon login, and the browser automatically sends it with every subsequent request. The frontend never touches the token directly.

### 🛡️ Strict Data Isolation
Every API endpoint performs a rigorous ownership check. A user cannot view, edit, or delete a project or task unless the `ownerId` in the database matches the authenticated user's ID. This logic is decoupled into reusable service methods for consistency.

---

## Setup Guide

### prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
The backend handles API logic and database connections.

```bash
cd backend
npm install
```

**Environment Configuration:**
Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=complex_secret_key_here
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

**Database Setup:**
```bash
npx prisma migrate dev
```

**Run Server:**
```bash
npm run start:dev
# Server starts at http://localhost:3001
```

### 2. Frontend Setup
The frontend is a Next.js application dependent on the backend.

```bash
cd frontend
npm install
```

**Run Client:**
```bash
npm run dev
# App starts at http://localhost:3000
```

**Access the App:**
Open [http://localhost:3000](http://localhost:3000). You will be automatically redirected to the Login page.

---

## Technical Challenges & Solutions

During the development lifecycle, we encountered and resolved several interesting technical challenges:

### 1. Secure Token Handling (HttpOnly)
**Challenge**: Since the frontend cannot read HttpOnly cookies, it had no way of knowing *who* was logged in or if a session existed.
**Solution**: We implemented a dedicated protected endpoint `GET /auth/profile`. The frontend calls this on mount; if it succeeds, the user is authenticated. If it fails (401), the user is redirected to Login.

### 2. Next.js 15 Hydration Mismatches
**Challenge**: Browser extensions (like Grammarly) injected attributes into the `<body>` tag, causing React hydration errors because the server-rendered HTML didn't match the client's DOM.
**Solution**: We added `suppressHydrationWarning` to the `<body>` tag in `layout.tsx`. This safely tells React to ignore attribute differences on that specific tag without disabling hydration elsewhere.

### 3. NestJS Middleware & CommonJS Compatibility
**Challenge**: The `cookie-parser` middleware caused a `TypeError: cookieParser is not a function` at runtime due to CommonJS/ESM interop issues in the NestJS environment.
**Solution**: We adjusted the import statement to `import cookieParser from 'cookie-parser'` and cast the usage as `app.use((cookieParser as any)());` to satisfy TypeScript's strict call signature checks while ensuring runtime compatibility.

### 4. Kanban Reordering Logic
**Challenge**: Implementing drag-and-drop requires updating the order of tasks. A naive approach of "swap" doesn't work well for lists.
**Solution**: We implemented a `PATCH /tasks/:id/move` endpoint that accepts a `newOrder`. While the current MVP updates the single task's order, the architecture allows for future expansion to bulk-update sibling tasks for perfect positioning.

---

## Architecture

We utilized a **Monorepo-style** structure (without workspaces complexity) for clarity:

- `backend/`: Contains the NestJS REST API. It uses a **Module-Controller-Service** pattern to separate transport concerns (HTTP) from business logic.
- `frontend/`: Contains the Next.js Client. It uses a **Feature-based** structure (`components/KanbanBoard`, `app/dashboard`) to keep UI logic close to where it's used.

This separation ensures that the backend remains a pure, stateless API service, while the frontend handles all presentation and interactive state.
