# BoilerOps Implementation Plan

## Phase 1: Foundation & Setup
- [x] Initialize Next.js project (TypeScript, Tailwind CSS, App Router) <!-- id: 0 -->
- [x] Setup shadcn/ui or basic component library structure <!-- id: 1 -->
- [ ] Configure Design System (Colors, Fonts per PRD) in `globals.css` / `tailwind.config.ts` <!-- id: 2 -->
- [ ] Create basic Layout with Navbar and mobile-first container <!-- id: 3 -->

## Phase 2: Database & Backend (PostgreSQL)
- [ ] Setup Vercel Postgres (Neon) for seamless Vercel deployment <!-- id: 4 -->
- [ ] Install & Setup Drizzle ORM (Connect to Vercel Postgres) <!-- id: 5 -->
- [ ] Define Database Schema (Users, Attendance, ShiftLogs, Breakdowns) <!-- id: 6 -->
- [ ] Run migrations to creates tables in Vercel Postgres <!-- id: 6b -->

## Phase 3: Authentication & Security (Manual Auth)
- [ ] Setup NextAuth.js (Auth.js) v5 with Credentials Provider <!-- id: 7 -->
- [ ] Implementation User Registration/Seeding script (Admin only) <!-- id: 8 -->
- [ ] Create Login Page (Email/Password form) <!-- id: 9 -->
- [ ] Setup Middleware for route protection <!-- id: 9b -->

## Phase 4: Core Features
### 4.1 Attendance
- [ ] Create Attendance Form (Operator, Shift, Boiler Selection) <!-- id: 10 -->
- [ ] Implement "Check-in" logic with one-per-shift rule <!-- id: 11 -->

### 4.2 Boiler Shift Log
- [ ] Create Shift Log Form (Pressure, Temp, Fuel, etc.) <!-- id: 12 -->
- [ ] Implement validation (Mandatory fields) & Submission <!-- id: 13 -->

### 4.3 Breakdown Log
- [ ] Create Breakdown Report Form <!-- id: 14 -->
- [ ] Implement submission logic <!-- id: 15 -->

### 4.4 Records & Dashboard
- [ ] Build Records Table View (Shift Logs, Attendance, Breakdowns) <!-- id: 16 -->
- [ ] Implement Filters (Date, Boiler, Shift) <!-- id: 17 -->
- [ ] Operator vs Supervisor view logic <!-- id: 18 -->

## Phase 5: UI Polish & optimization
- [ ] Verify "Industrial Logbook" Aesthetic (Contrast, Color Palette) <!-- id: 19 -->
- [ ] Mobile Responsiveness check <!-- id: 20 -->
- [ ] Performance Optimization <!-- id: 21 -->
