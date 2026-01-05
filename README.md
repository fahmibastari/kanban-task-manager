# Kanban Task Manager

A professional full-stack Kanban board application demonstrating clean architecture, strict typing, and secure data isolation.

## Tech Stack

### Backend
- **Framework**: NestJS (Modular Architecture)
- **Language**: TypeScript (Strict Mode)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT w/ HTTP-Only Cookies (Secure & XSS-Resistant)
- **Validation**: `class-validator` & `class-transformer` Global Pipes

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **State/Interactivity**: @hello-pangea/dnd (Kanban)

## Features

### Authentication & Security
- **Secure Auth**: Stateless JWT authentication stored in HTTP-Only cookies.
- **Guards**: `JwtAuthGuard` applied to protected routes to prevent unauthorized access.
- **Input Validation**: Strict DTO validation prevents data injection and ensures type safety.

### Project Management
- **CRUD Operations**: Complete management of Projects.
- **Data Isolation**: Application logic strictly enforces ownership checks—users can only access and modify their own projects.

## Getting Started

### Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Setup Database:
   ```bash
   npx prisma migrate dev
   ```
4. Setup Environment Variables:
   Create a `.env` file in the `backend` folder:
   ```env
   JWT_SECRET=your_super_secret_key_123
   DATABASE_URL="file:./dev.db"
   ```
5. Run Development Server:
   ```bash
   npm run start:dev
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run Development Server:
   ```bash
   npm run dev
   ```
3. Open your browser:
   Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically redirect to the login page.
