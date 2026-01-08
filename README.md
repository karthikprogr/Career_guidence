# 🎓 Career Guidance Web Application

[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> A comprehensive career guidance platform that helps students choose the right college and course based on their academic performance, preferences, and aptitude test results.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Usage Guide](#usage-guide)
- [Modules](#modules)
- [Security](#security)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

The **Career Guidance Application** is a web-based platform designed to assist students and parents in making informed decisions about higher education. It evaluates student eligibility, conducts aptitude assessments, and recommends suitable colleges based on multiple criteria including CGPA, exam scores, location preferences, and aptitude test performance.

### Key Highlights

- **Role-Based Access**: Separate interfaces for Students and Admins
- **Intelligent Filtering**: Advanced college recommendation system
- **Aptitude Assessment**: Comprehensive MCQ-based test with 30 minutes timer
- **Real-Time Data**: Firebase Firestore for instant updates
- **Secure Authentication**: Firebase Authentication with role management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Comprehensive Logging**: Track all user actions for analytics

---

## 🔍 Problem Statement

Students and parents often face challenges in finding comprehensive information about colleges, including tuition fees, eligibility requirements, campus placements, facilities, scholarships, and more. This application provides:

- **Centralized Information**: All college details in one place
- **Eligibility Evaluation**: Automatic verification based on CGPA and exam scores
- **Location-Based Search**: Filter colleges by India or Abroad
- **Aptitude Testing**: Assess verbal, quantitative, and general knowledge skills
- **Personalized Recommendations**: Tailored suggestions based on student profile

---

## ✨ Features

### For Students

- ✅ **User Registration & Authentication**
  - Email/password signup and login
  - Secure session management
  
- ✅ **Profile Management**
  - Academic details (CGPA, exam scores)
  - Personal information
  - Career and location preferences
  
- ✅ **Career & Location Selection**
  - Choose from Engineering, Management, Medical, Law, Science, Arts
  - Select India or Abroad for study location
  
- ✅ **Aptitude Test**
  - 30-minute timed test
  - 30 questions across 3 categories:
    - Verbal (10 questions)
    - Quantitative (10 questions)
    - General Knowledge (10 questions)
  - Immediate score calculation
  - Performance analysis
  
- ✅ **College Search & Filter**
  - Filter by location, type, fees, ranking
  - Eligibility-based recommendations
  - Detailed college information
  
- ✅ **College Details Page**
  - Comprehensive college information
  - Fees, ranking, placement rate
  - Facilities and scholarships
  - Registration process

### For Admins

- ✅ **College Management**
  - Add new colleges
  - Update college information
  - Delete colleges
  
- ✅ **Aptitude Question Management**
  - Add questions with multiple options
  - Set correct answers
  - Categorize by type (Verbal/Quantitative/General)
  - Set difficulty levels (Easy/Medium/Hard)
  
- ✅ **Dashboard Analytics**
  - View all colleges
  - Manage question bank

### General Features

- ✅ **Responsive Design**: Mobile, tablet, and desktop friendly
- ✅ **Real-Time Updates**: Firebase Firestore synchronization
- ✅ **Secure Routes**: Protected pages based on authentication
- ✅ **Comprehensive Logging**: All actions logged for audit trail
- ✅ **Error Handling**: User-friendly error messages

---

## 🛠 Technologies Used

### Frontend

- **React 18.2.0** - UI library
- **React Router DOM 6.20.0** - Client-side routing
- **HTML5 & CSS3** - Markup and styling
- **JavaScript (ES6+)** - Programming logic

### Backend

- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Hosting** - Web hosting

### Development Tools

- **Create React App** - Project scaffolding
- **Git** - Version control
- **VS Code** - Code editor

---

## 📁 Project Structure

```
career-guidance-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── ProtectedRoute.js
│   │   ├── CollegeCard.js
│   │   └── CollegeCard.css
│   ├── pages/
│   │   ├── Login.js
│   │   ├── SignUp.js
│   │   ├── Auth.css
│   │   ├── StudentDashboard.js
│   │   ├── StudentDashboard.css
│   │   ├── AdminDashboard.js
│   │   ├── AdminDashboard.css
│   │   ├── CareerSelection.js
│   │   ├── LocationSelection.js
│   │   ├── Selection.css
│   │   ├── StudentDetails.js
│   │   ├── StudentDetails.css
│   │   ├── CollegeList.js
│   │   ├── CollegeList.css
│   │   ├── CollegeDetails.js
│   │   ├── CollegeDetails.css
│   │   ├── AptitudeTest.js
│   │   ├── AptitudeTest.css
│   │   ├── TestCompletion.js
│   │   └── TestCompletion.css
│   ├── App.js
│   ├── firebase.js
│   ├── logger.js
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/career-guidance-app.git
cd career-guidance-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `career-guidance-app`
4. Follow the setup wizard

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable **Email/Password** provider
3. Save changes

### 3. Create Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose **Start in production mode**
4. Select location (e.g., us-central)
5. Create database

### 4. Deploy Security Rules

Copy the contents of `firestore.rules` to Firebase Console:

1. Go to Firestore Database → Rules
2. Paste the rules from `firestore.rules`
3. Publish changes

### 5. Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click Web icon (</>) to add web app
4. Copy the configuration object
5. Add values to your `.env` file

### 6. Deploy to Firebase Hosting (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Select:
# - Hosting
# - Firestore (rules and indexes)

# Build the app
npm run build

# Deploy
firebase deploy
```

---

## 📖 Usage Guide

### For Students

#### 1. Sign Up

1. Navigate to the app
2. Click "Sign Up"
3. Fill in details:
   - Full Name
   - Email
   - Password
   - Select Role: **Student**
4. Click "Sign Up"

#### 2. Complete Profile

1. After login, go to Dashboard
2. Click "Complete Profile"
3. Enter academic details:
   - CGPA
   - Entrance exam scores (JEE, NEET, CAT, etc.)
   - Phone number
   - Date of birth
   - Address
4. Save details

#### 3. Select Career & Location

1. Choose career path (Engineering, Management, etc.)
2. Select location preference (India or Abroad)
3. Confirm selections

#### 4. Take Aptitude Test

1. Go to Dashboard → Start Test
2. Read instructions carefully
3. Complete 30 questions in 30 minutes
4. Submit test
5. View score and performance

#### 5. Browse Colleges

1. Navigate to "Colleges" from navbar
2. Use filters:
   - Location
   - Type
   - Fees range
   - Ranking
3. View eligible colleges
4. Click on college for details

### For Admins

#### 1. Sign Up as Admin

1. Click "Sign Up"
2. Select Role: **Admin**
3. Complete registration

#### 2. Add Colleges

1. Go to Admin Dashboard
2. Click "Colleges Management" tab
3. Click "Add College"
4. Fill in college details:
   - Name
   - Location (India/Abroad)
   - Type
   - Fees
   - Ranking
   - Min CGPA
   - Placement Rate
   - Description
   - Facilities
   - Scholarships
5. Submit

#### 3. Add Aptitude Questions

1. Go to "Aptitude Questions" tab
2. Click "Add Question"
3. Enter question details:
   - Question text
   - Category (Verbal/Quantitative/General)
   - Difficulty (Easy/Medium/Hard)
   - 4 options
   - Correct answer
4. Submit

---

## 📦 Modules

### 1. Authentication Module

- **Files**: `Login.js`, `SignUp.js`
- **Features**:
  - Email/password authentication
  - Role-based registration (Student/Admin)
  - Secure session management
  - Protected routes

### 2. Student Module

- **Files**: `StudentDashboard.js`, `StudentDetails.js`, `CareerSelection.js`, `LocationSelection.js`
- **Features**:
  - Profile management
  - Career and location selection
  - Academic details management
  - Dashboard overview

### 3. Admin Module

- **Files**: `AdminDashboard.js`
- **Features**:
  - College CRUD operations
  - Aptitude question management
  - Dashboard analytics

### 4. College Module

- **Files**: `CollegeList.js`, `CollegeDetails.js`, `CollegeCard.js`
- **Features**:
  - Advanced filtering
  - Eligibility checking
  - Detailed college information
  - Registration process guide

### 5. Aptitude Test Module

- **Files**: `AptitudeTest.js`, `TestCompletion.js`
- **Features**:
  - 30-minute timed test
  - 30 MCQ questions
  - 3 categories (Verbal, Quantitative, General)
  - Immediate scoring
  - Performance analysis

### 6. Logging Module

- **File**: `logger.js`
- **Features**:
  - Comprehensive action logging
  - Log levels (INFO, WARNING, ERROR, SUCCESS)
  - Firebase storage
  - Console output for development

---

## 🔒 Security

### Firestore Security Rules

The application implements strict security rules:

- **Authentication Required**: All operations require authenticated users
- **Role-Based Access**:
  - Students can only read/write their own data
  - Admins can manage colleges and questions
  - Logs are admin-readable only
- **Data Validation**: Rules validate data types and required fields

### Best Practices Implemented

- ✅ Environment variables for sensitive data
- ✅ Client-side route protection
- ✅ Server-side security rules
- ✅ Password requirements (min 6 characters)
- ✅ Input validation
- ✅ Error handling

---

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Build the production app**

```bash
npm run build
```

2. **Initialize Firebase** (if not done)

```bash
firebase init
```

3. **Deploy**

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Sign up as Student
- [ ] Sign up as Admin
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout

#### Student Flow
- [ ] Complete profile
- [ ] Select career
- [ ] Select location
- [ ] Take aptitude test
- [ ] Browse colleges
- [ ] Filter colleges
- [ ] View college details

#### Admin Flow
- [ ] Add college
- [ ] Delete college
- [ ] Add aptitude question
- [ ] Delete question

#### General
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Navigation between pages
- [ ] Error messages display
- [ ] Loading states work

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Unified Mentor for the internship opportunity
- Firebase for backend infrastructure
- React community for excellent documentation

---

## 📞 Contact

For queries or support:

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 📸 Screenshots

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Aptitude Test
![Aptitude Test](screenshots/aptitude-test.png)

### College List
![College List](screenshots/college-list.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

---

## 🗺️ Roadmap

- [ ] Add email notifications
- [ ] Implement advanced analytics
- [ ] Add PDF report generation
- [ ] Integrate payment gateway for applications
- [ ] Add chat support
- [ ] Implement college comparison feature
- [ ] Add student community forum

---

**Made with ❤️ for Unified Mentor Internship**
