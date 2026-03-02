# Career Guidance Web Application

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A comprehensive career guidance platform that helps students and parents find the right college — in India or abroad — based on academic performance, entrance exam scores, career interests, location preferences, and aptitude test results.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Application Workflow](#application-workflow)
- [Modules](#modules)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [Firestore Data Model](#firestore-data-model)
- [Logging](#logging)
- [Security](#security)
- [Test Cases](#test-cases)
- [Deployment](#deployment)
- [Coding Standards](#coding-standards)
- [License](#license)

---

## Problem Statement

Students and parents often struggle to access comprehensive information about colleges — tuition fees, housing, eligibility requirements, placements, scholarships, and more. This application provides:

- A centralised platform covering Indian and international institutions
- Eligibility evaluation based on CGPA, entrance exam scores, and aptitude test results
- Location-based filtering (India or Abroad)
- Personalised aptitude assessment aligned to the student's career domain
- Step-by-step college application and registration guidance

The platform covers Engineering, Management, Medical, Law, Science, and Arts & Humanities disciplines.

---

## Features

### Student Features

| Feature | Description |
|---------|-------------|
| Registration & Login | Email/password auth with role selection |
| Profile Management | CGPA, entrance exam scores (JEE/NEET/CAT/GMAT), personal info, name & password change |
| Career Selection | Choose from Engineering, Management, Medical, Law, Science, Arts |
| Location Selection | India or Abroad study preference |
| Career Roadmap | AI-generated step-by-step guidance for chosen career path |
| College List | Filtered by career, location, fees, ranking with eligibility highlighting |
| College Details | Full info — fees (multi-currency), facilities, scholarships, accreditation, contact |
| College Comparison | Side-by-side compare up to 3 colleges |
| College Application | Online registration with CGPA + aptitude score eligibility check |
| Application History | Track all submitted applications and their status |
| Aptitude Test | 30-min, 30-question domain-personalised MCQ test |
| Test Completion | Score, performance level, correct/wrong count, next-step recommendations |

### Admin Features

| Feature | Description |
|---------|-------------|
| College Management | Add, edit, delete colleges (India + Abroad with multi-currency support) |
| Quick College Seeding | One-click load of 30+ curated colleges (India + Abroad) |
| Question Management | Add/edit/delete MCQs by category, difficulty, and career domain |
| Applications Management | View all student applications with student details |
| Student Management | View all registered students |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18.2.0, React Router DOM 6.20 |
| UI Icons | Lucide React |
| Backend / Auth | Firebase Authentication (Email/Password) |
| Database | Firebase Firestore (NoSQL) |
| Hosting | Firebase Hosting |
| Build Tool | Vite 5.0.8 |
| Language | JavaScript ES6+ |
| Styling | CSS3 (dark theme, responsive, mobile-first) |
| AI Integration | Groq SDK (career roadmap generation) |

---

## Project Structure

```
career-guidance-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CollegeCard.jsx         # Reusable card with multi-currency fees
│   │   ├── CollegeCard.css
│   │   ├── Icons.jsx               # Custom SVG icon components
│   │   ├── Modals.css              # Shared modal styles
│   │   ├── Navbar.jsx              # Responsive nav + mobile bottom bar
│   │   ├── Navbar.css
│   │   └── ProtectedRoute.jsx      # Role-based route guard
│   ├── pages/
│   │   ├── AdminDashboard.jsx      # Admin: colleges, questions, applications, students
│   │   ├── AdminDashboard.css
│   │   ├── ApplicationHistory.jsx  # Student: submitted applications
│   │   ├── AptitudeTest.jsx        # Domain-aware 30-question timed test
│   │   ├── AptitudeTest.css
│   │   ├── Auth.css                # Shared login/signup styles
│   │   ├── CareerRoadmap.jsx       # AI-generated career roadmap
│   │   ├── CareerSelection.jsx     # Pick career domain
│   │   ├── CollegeApplication.jsx  # Registration form + eligibility check
│   │   ├── CollegeApplication.css
│   │   ├── CollegeComparison.jsx   # Side-by-side college comparison
│   │   ├── CollegeDetails.jsx      # Full college info page
│   │   ├── CollegeDetails.css
│   │   ├── CollegeList.jsx         # Filtered college listing
│   │   ├── CollegeList.css
│   │   ├── LandingPage.jsx         # Public home page
│   │   ├── LandingPage.css
│   │   ├── LocationSelection.jsx   # India / Abroad selection
│   │   ├── Login.jsx               # Login with demo credentials
│   │   ├── Selection.css           # Career + location selection styles
│   │   ├── SignUp.jsx              # Student / Admin registration
│   │   ├── StudentDashboard.jsx    # Student home with quick actions
│   │   ├── StudentDashboard.css
│   │   ├── StudentDetails.jsx      # Profile: personal info, academics, password
│   │   ├── StudentDetails.css
│   │   ├── TestCompletion.jsx      # Score display + next steps
│   │   └── TestCompletion.css
│   ├── utils/
│   │   └── addSampleColleges.js    # Bulk college seeding (India + Abroad)
│   ├── App.jsx                     # Route definitions + auth state
│   ├── firebase.jsx                # Firebase app initialisation
│   ├── index.css                   # Global dark-theme CSS variables
│   ├── logger.jsx                  # Structured logging utility
│   └── main.jsx                    # React entry point
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
└── README.md
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │  Public  │  │  Student  │  │       Admin          │  │
│  │  Pages   │  │  Routes   │  │       Routes         │  │
│  └────┬─────┘  └─────┬─────┘  └──────────┬───────────┘  │
│       │              │                   │               │
│  ┌────▼──────────────▼───────────────────▼───────────┐  │
│  │          React Router (Protected Routes)            │  │
│  └────────────────────────┬────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Firebase SDK   │
                   └────────┬────────┘
          ┌─────────────────┼──────────────────┐
          ▼                 ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Firebase    │  │  Firestore   │  │  Groq API    │
  │  Auth        │  │  Database    │  │  (Roadmap)   │
  └──────────────┘  └──────────────┘  └──────────────┘
```

**Firestore Collections:**

| Collection | Purpose |
|-----------|---------|
| `users` | Role assignment (student / admin) |
| `students` | Profile, CGPA, exam scores, preferences, aptitude score |
| `colleges` | All college details — India + Abroad, multi-currency |
| `questions` | Aptitude MCQs: category, difficulty, career domain |
| `applications` | Student college applications with status |
| `testResults` | Per-student aptitude test results |
| `logs` | System activity audit trail |

---

## Application Workflow

```
User Visit
    │
    ├─ Not logged in ──► Landing Page ──► Login / Sign Up
    │
    └─ Logged in
           │
           ├─ Admin ──► Admin Dashboard
           │              ├─ Manage Colleges (Add / Edit / Delete / Bulk Seed)
           │              ├─ Manage Questions (Add / Edit / Delete)
           │              ├─ View Applications
           │              └─ View Students
           │
           └─ Student ──► Student Dashboard
                           │
                           ├─ 1. Complete Profile (CGPA, exam scores, personal info)
                           │
                           ├─ 2. Select Career (Engineering / Management / Medical /
                           │                    Law / Science / Arts)
                           │
                           ├─ 3. Select Location (India or Abroad)
                           │
                           ├─ 4. Browse College List
                           │      ├─ Filter by location, type, fees, ranking
                           │      ├─ View full college details
                           │      ├─ Compare colleges side-by-side
                           │      └─ Apply to college (eligibility checked)
                           │
                           ├─ 5. Take Aptitude Test (30 min, 30 domain MCQs)
                           │      └─ View Score + Performance Analysis
                           │
                           └─ 6. View Career Roadmap (AI-generated)
```

---

## Modules

### 1. Authentication Module
Files: `Login.jsx`, `SignUp.jsx`, `ProtectedRoute.jsx`
- Email/password sign up and login via Firebase Auth
- Role selection at sign-up (Student / Admin)
- Protected routes enforce role-based access
- Demo credentials shown on login page

### 2. Student Profile Module
Files: `StudentDetails.jsx`
- Editable: full name, phone, DOB, address, CGPA, academic percentages
- Entrance exam scores: JEE / NEET / CAT / GMAT / Other
- Change password with re-authentication

### 3. Career & Location Module
Files: `CareerSelection.jsx`, `LocationSelection.jsx`
- Six career domains stored in `students/{uid}.preferences.career`
- Two locations stored in `students/{uid}.preferences.location`
- Drive college filtering and aptitude test domain

### 4. College Module
Files: `CollegeList.jsx`, `CollegeDetails.jsx`, `CollegeCard.jsx`, `CollegeComparison.jsx`
- Dynamic filters: location, type, fee range, ranking
- Multi-currency fees display (INR / USD / GBP / EUR / AUD / CAD / SGD / CHF / SEK)
- Eligibility badge based on student CGPA
- Side-by-side comparison of up to 3 colleges

### 5. College Application Module
Files: `CollegeApplication.jsx`, `ApplicationHistory.jsx`
- Full registration form with personal + academic details
- CGPA eligibility check with visual pass/fail banner
- Aptitude test score shown in context
- Application saved with `pending` status

### 6. Aptitude Test Module
Files: `AptitudeTest.jsx`, `TestCompletion.jsx`
- 30 questions, 30-minute countdown
- 10 verbal + 10 quantitative + 10 domain-specific (based on career)
- Career personalisation banner with "Change Career Path" option
- Performance levels: Excellent / Good / Average / Needs Improvement

### 7. Career Roadmap Module
File: `CareerRoadmap.jsx`
- AI-generated step-by-step roadmap via Groq SDK
- Personalised to student's selected career

### 8. Admin Module
File: `AdminDashboard.jsx`
- Tabbed interface: Colleges | Questions | Applications | Students
- College CRUD with multi-currency support
- Question CRUD with career domain tagging
- View and manage all student applications

### 9. Logging Module
File: `logger.jsx`
- Levels: INFO / SUCCESS / WARNING / ERROR
- All actions logged: auth, profile, test, applications, admin changes
- Stored in Firestore `logs` collection

---

## Pages

| # | Page | Route | Description |
|---|------|--------|-------------|
| 1 | Landing Page | `/` | Public home page |
| 2 | Login | `/login` | Student / Admin login |
| 3 | Sign Up | `/signup` | Student / Admin registration |
| 4 | Student Dashboard | `/student` | Home with quick actions and stats |
| 5 | Career Selection | `/career-selection` | Pick career domain |
| 6 | Location Selection | `/location-selection` | India or Abroad |
| 7 | College List | `/college-list` | Filtered, sortable listings |
| 8 | College Details | `/college/:id` | Full college information |
| 9 | College Comparison | `/college-compare` | Side-by-side comparison |
| 10 | College Application | `/college-apply/:collegeId` | Registration + eligibility |
| 11 | Application History | `/applications` | My submitted applications |
| 12 | Student Details | `/student-details` | Profile and academic info |
| 13 | Aptitude Test | `/aptitude-test` | Domain-aware timed test |
| 14 | Test Completion | `/test-completion` | Score and analysis |
| 15 | Career Roadmap | `/career-roadmap` | AI-generated guidance |
| 16 | Admin Dashboard | `/admin` | Full admin panel |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Firebase account

### Installation

```bash
git clone https://github.com/yourusername/career-guidance-app.git
cd career-guidance-app
npm install
copy .env.example .env   # then fill in Firebase config
npm run dev
```

App runs at `http://localhost:5173`

---

## Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/) → New project
2. **Authentication** → Sign-in method → Enable Email/Password
3. **Firestore** → Create database → Production mode
4. Project Settings → Add Web App → copy config to `.env`
5. Paste `firestore.rules` into Firestore → Rules → Publish

---

## Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
```

---

## Firestore Data Model

### `students/{uid}`
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "cgpa": "number",
  "tenthPercentage": "number",
  "twelfthPercentage": "number",
  "examScores": { "jee": "number", "neet": "number", "cat": "number", "gmat": "number" },
  "preferences": { "career": "engineering|management|medical|law|science|arts", "location": "india|abroad" },
  "aptitudeScore": "number"
}
```

### `colleges/{id}`
```json
{
  "name": "string",
  "type": "Engineering|Management|Medical|Law|Science|Arts",
  "location": "string",
  "country": "string",
  "fees": "number",
  "currency": "INR|USD|GBP|EUR|AUD|CAD|SGD|CHF|SEK",
  "minCGPA": "number",
  "ranking": "number",
  "placementRate": "number",
  "description": "string",
  "facilities": "string",
  "scholarships": "string",
  "accreditation": "string",
  "website": "string"
}
```

### `questions/{id}`
```json
{
  "question": "string",
  "options": ["string","string","string","string"],
  "correctAnswer": "number (0-3)",
  "category": "verbal|quantitative|general|engineering|management|medical|law|science|arts",
  "difficulty": "easy|medium|hard"
}
```

### `applications/{id}`
```json
{
  "studentId": "string",
  "collegeId": "string",
  "collegeName": "string",
  "cgpa": "number",
  "testScore": "number",
  "preferredCourse": "string",
  "status": "pending|accepted|rejected",
  "appliedAt": "timestamp"
}
```

---

## Logging

```javascript
import { logInfo, logSuccess, logError, logWarning } from '../logger';

logInfo('MODULE', 'Description', { key: value });
logSuccess('MODULE', 'Action completed', { result });
logError('MODULE', 'Action failed', { error: error.message });
```

Logged events: login/logout, profile update, career selection, test start/submit, college view/apply, all admin CRUD operations, all Firestore errors. Stored in Firestore `logs` collection.

---

## Security

- All Firestore reads/writes require authentication
- Students can only access their own profile data
- Admins-only: college and question management
- Application eligibility validated before save
- Passwords require minimum 6 chars; re-auth required for password change
- All secrets in `.env` — never committed to Git

---

## Test Cases

### TC-01: Student Registration
| Step | Action | Expected |
|------|--------|---------|
| 1 | Sign up with valid details, role = Student | Redirected to `/student` |
| 2 | Register with existing email | Error: "Email already in use" |
| 3 | Password under 6 chars | Error: "Password too short" |

### TC-02: Student Login
| Step | Action | Expected |
|------|--------|---------|
| 1 | Login with correct credentials | Redirected to Student Dashboard |
| 2 | Login with wrong password | Error: "Invalid credentials" |
| 3 | Admin URL accessed by student | Redirected to `/student` |

### TC-03: Profile Management
| Step | Action | Expected |
|------|--------|---------|
| 1 | Enter CGPA = 8.5, save | `students/{uid}.cgpa = 8.5` in Firestore |
| 2 | Enter JEE = 12000, save | `examScores.jee = 12000` in Firestore |
| 3 | Change display name | Firebase Auth + Firestore `name` both updated |
| 4 | Change password with wrong current password | Error: "Incorrect current password" |

### TC-04: Career & Location Selection
| Step | Action | Expected |
|------|--------|---------|
| 1 | Select "Engineering" | `preferences.career = 'engineering'` saved |
| 2 | Select "Abroad" | `preferences.location = 'abroad'` saved |
| 3 | Go to college list | Pre-filtered for abroad engineering colleges |

### TC-05: College List Filtering
| Step | Action | Expected |
|------|--------|---------|
| 1 | Max Fees = 500000 | Only colleges with fees ≤ 500000 shown |
| 2 | Type = Medical | Only medical colleges shown |
| 3 | Sort by Ranking | Rankings shown in ascending order |
| 4 | Student CGPA 7.0, college min 8.0 | Card shows "Not Eligible" badge |

### TC-06: College Application
| Step | Action | Expected |
|------|--------|---------|
| 1 | CGPA ≥ minCGPA, fill form, submit | Application saved with status = "pending" |
| 2 | CGPA < minCGPA, try submit | Alert: "CGPA does not meet requirement" |
| 3 | Open `/applications` | All applications listed with status |

### TC-07: Aptitude Test Domain Personalisation
| Step | Action | Expected |
|------|--------|---------|
| 1 | Career = "Medical", open test | Banner shows "Personalized for Medical"; 10 medical questions in section 3 |
| 2 | No career set | Section 3 uses general knowledge |
| 3 | Click "Change Career Path" | Navigated to `/career-selection` |
| 4 | Timer hits 0:00 | Test auto-submits |

### TC-08: Aptitude Test Scoring
| Step | Action | Expected |
|------|--------|---------|
| 1 | 24/30 correct | Score = 80%, "Excellent" |
| 2 | 0/30 correct | Score = 0%, "Needs Improvement" |
| 3 | Complete test | `testResults/{uid}` and `students/{uid}.aptitudeScore` written |

### TC-09: Admin College Management
| Step | Action | Expected |
|------|--------|---------|
| 1 | Add college with all fields | College appears in student listing |
| 2 | Edit college name | Updated in Firestore and UI |
| 3 | Delete college | Removed from Firestore |
| 4 | Add abroad college with USD currency | Fees shown as "$57,986" not "₹57,986" |
| 5 | Click "Add Simple Colleges" | 30+ colleges added across all types |

### TC-10: Admin Question Management
| Step | Action | Expected |
|------|--------|---------|
| 1 | Add verbal question | Appears in question bank |
| 2 | Set category = "Engineering" | Engineering students get this question in section 3 |
| 3 | Delete question | Removed from Firestore |

### TC-11: Multi-Currency Fees
| Step | Action | Expected |
|------|--------|---------|
| 1 | Indian college (INR) on card | Shows "₹1,00,000" |
| 2 | US college (USD) on card | Shows "$57,986" |
| 3 | UK college (GBP) on detail page | Shows "£35,000" |
| 4 | Swiss college (CHF) on application page | Shows "CHF 730" |

### TC-12: Responsive Design
| Step | Action | Expected |
|------|--------|---------|
| 1 | View on 375px mobile | Bottom nav bar visible; top pill nav hidden |
| 2 | View on 1200px desktop | Top pill nav visible; bottom bar hidden |
| 3 | College list on 768px tablet | 2-column card grid |

---

## Deployment

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init    # select Hosting + Firestore
firebase deploy
```

Live at: `https://your-project-id.web.app`

---

## Coding Standards

- **Modular**: Each feature is a self-contained page or component
- **Safe**: No hardcoded secrets; Firestore rules enforce server-side security
- **Testable**: Pure helpers (`formatFees`, `shuffleArray`, `calculateScore`) are isolated
- **Maintainable**: Consistent naming conventions; CSS co-located with component
- **Portable**: `.env` for all environment config; works on any OS
- **Firebase-first**: All data via Firestore SDK with structured error handling
- **Logging**: Every significant action logged via `logger.jsx` to Firestore

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built for Unified Mentor Internship**
