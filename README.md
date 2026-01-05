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

---

## Development Journey

This section documents the complete evolution of the project, organized chronologically by implementation phase:

### Phase 1: Backend Foundation (Commits 1-3)

#### Commit 1: Auth Guard & Strict Validation
**Focus**: Security-first authentication infrastructure.

Implemented `JwtStrategy` to extract tokens from HTTP-Only cookies and created `JwtAuthGuard` to protect private routes. Added strict input validation using `ValidationPipe` with DTOs (`CreateUserDto`, `LoginDto`).

**Key Decision**: Chose to enforce validation globally rather than per-route to prevent any unsafe data from entering the system.

#### Commit 2: Project Module with Data Isolation
**Focus**: Core project management with ownership enforcement.

Built the complete Projects CRUD system with strict data isolation. Every operation validates that `ownerId === userId` before proceeding.

**Key Decision**: Manually implemented `UpdateProjectDto` instead of using `PartialType` from `@nestjs/mapped-types` to avoid an extra dependency for a single DTO.

#### Commit 3: Task Module & Kanban Logic
**Focus**: Task management with drag-and-drop support.

Implemented the Tasks module with a dedicated `/tasks/:id/move` endpoint for Kanban reordering. Added a reusable `validateProjectOwnership` helper method to ensure users only create tasks in their own projects.

**Key Decision**: Separated the "move" logic from "update" to keep concerns clear and allow for future bulk-reordering optimizations.

### Phase 2: API Completion (Commit 4)

#### Commit 4: Auth Polish (Profile & Logout)
**Focus**: Session management and user context.

Added `GET /auth/profile` (protected endpoint returning user info) and `POST /auth/logout` (clears the access_token cookie).

**Key Decision**: Since cookies are HttpOnly, the frontend cannot read them to know who's logged in. The `/auth/profile` endpoint solves this by allowing the frontend to fetch the current user context on mount.

### Phase 3: Frontend Development (Commit 5)

#### Commit 5: Frontend Implementation
**Focus**: Complete UI with authentication and Kanban board.

Initialized Next.js 15, implemented `AuthContext` for global auth state, built Login/Register pages with Shadcn/UI, and integrated the Kanban Board using `@hello-pangea/dnd`.

**Technical Resolutions**:
- Fixed `cookieParser is not a function` by changing from `import * as cookieParser` to `import cookieParser`
- Removed nested `.git` directory from `create-next-app` to maintain clean monorepo structure
- Resolved hydration mismatch by adding `suppressHydrationWarning` to handle browser extension interference
- Fixed 401 errors caused by stale `Authentication` cookie (legacy naming) by forcing fresh login with correct `access_token` cookie

### Phase 4: Feature Completion (Commit 6)

#### Commit 6: Polish & UI Completeness
**Focus**: Complete CRUD UI and environment variable security.

Added Edit/Delete functionality for both Projects (Dashboard) and Tasks (Kanban Board). Refactored backend to use `@nestjs/config` with `.env` file for `JWT_SECRET`.

**Key Decision**: Moved all sensitive configuration to environment variables to prevent accidental commits of secrets and enable environment-specific configs.

### Phase 5: Production Readiness (Commits 7-10)

#### Commit 7: Final Code Cleanup
**Focus**: Professional code standards.

Removed all development comments, unused imports, and AI-generated notes. Standardized documentation style across Controllers and Modules.

**Key Decision**: Clean, self-documenting code is better than over-commented code. Variable names and structure should speak for themselves.

#### Commit 8: Localization (ID → EN)
**Focus**: International consistency.

Translated all user-facing strings (error messages, UI labels, button text) from Indonesian to English.

**Key Decision**: English as the primary language ensures broader accessibility and professional presentation.

#### Commit 9: Configuration Refactor
**Focus**: Best practices for database configuration.

Moved hardcoded SQLite path from `schema.prisma` to `.env` as `DATABASE_URL`.

**Key Decision**: Even local development databases should use environment variables for consistency with production deployment patterns.

#### Commit 10: UX Fix - Redirect Logic
**Focus**: Seamless authentication flow.

Updated Dashboard to automatically redirect unauthenticated users to `/login` instead of rendering "Access Denied".

**Key Decision**: Silent redirects provide better UX than error messages. The flow now seamlessly guides users: `/` → `/dashboard` → `/login` (if not authenticated).
