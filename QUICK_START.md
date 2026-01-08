# ⚡ QUICK START GUIDE

Get your Career Guidance App running in 10 minutes!

---

## 🎯 FASTEST PATH TO RUNNING APP

### 1️⃣ INSTALL DEPENDENCIES (2 minutes)

Open PowerShell and run:

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\career_guidence"
npm install
```

Wait for installation to complete...

---

### 2️⃣ SETUP FIREBASE (5 minutes)

#### A. Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: `career-guidance-app`
4. Disable Google Analytics
5. Click "Create project"

#### B. Enable Authentication
1. Click "Authentication" → "Get started"
2. Click "Email/Password" → Enable → Save

#### C. Create Firestore Database
1. Click "Firestore Database" → "Create database"
2. Select "Start in production mode" → Next
3. Choose location (e.g., asia-south1) → Enable

#### D. Get Config Values
1. Click gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps" → Click Web icon `</>`
3. Enter nickname: `Career Guidance App`
4. Click "Register app"
5. **COPY these values** (keep page open):
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

---

### 3️⃣ CREATE .ENV FILE (1 minute)

1. In your project folder, create a file named `.env`
2. Paste this and **replace with your values**:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ **IMPORTANT**: No spaces around `=` signs!

---

### 4️⃣ DEPLOY FIREBASE RULES (2 minutes)

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (choose Firestore + Hosting, select your project, public dir = dist)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

### 5️⃣ START THE APP (10 seconds)

```powershell
npm run dev
```

Open: http://localhost:3000

---

## 👤 CREATE ADMIN ACCOUNT

### Method 1: Using Firebase Console (Recommended)

1. **Go to Firebase Console → Authentication**
   - Click "Add user"
   - Email: `admin@test.com`
   - Password: `admin123` (or your choice)
   - Click "Add user"
   - **Copy the User UID**

2. **Go to Firestore Database**
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: Paste the User UID
   - Add fields:
     - `email` (string): `admin@test.com`
     - `name` (string): `Admin User`
     - `role` (string): `admin`
     - `createdAt` (timestamp): Current timestamp
   - Click "Save"

### Method 2: Using Signup Page

1. Go to http://localhost:3000/signup
2. Fill form:
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Role: **Admin** (select from dropdown)
3. Click "Sign Up"
4. Login with admin credentials

---

## 🎮 ADD SAMPLE DATA

### Login as Admin
- Email: `admin@test.com`
- Password: `admin123`

### Add Colleges (Admin Dashboard → Colleges Tab)

**College 1:**
- Name: IIT Delhi
- Location: India
- Type: Government
- Fees: 200000
- Ranking: 1
- Min CGPA: 8.5
- Placement Rate: 95

**College 2:**
- Name: MIT
- Location: Abroad
- Type: Private
- Fees: 5000000
- Ranking: 1
- Min CGPA: 9.0
- Placement Rate: 98

Add 3-5 more colleges...

### Add Questions (Admin Dashboard → Questions Tab)

**Verbal Questions (10):**
- "What is the synonym of 'Happy'?" → Joyful (correct)
- "Antonym of 'Big'?" → Small (correct)
- "Complete: He ___ to school." → Goes (correct)

**Quantitative Questions (10):**
- "2 + 2 = ?" → 4 (correct)
- "10 × 5 = ?" → 50 (correct)
- "√16 = ?" → 4 (correct)

**General Knowledge Questions (10):**
- "Capital of India?" → New Delhi (correct)
- "Who invented computer?" → Charles Babbage (correct)
- "Largest planet?" → Jupiter (correct)

---

## 👨‍🎓 TEST STUDENT FLOW

1. **Logout** from admin

2. **Sign Up as Student**
   - Name: Test Student
   - Email: student@test.com
   - Password: test123
   - Role: Student

3. **Complete Profile**
   - CGPA: 8.0
   - JEE Score: 85
   - Phone: 9876543210
   - DOB: 2005-01-01
   - Address: Test Address

4. **Select Career**
   - Choose "Engineering"

5. **Select Location**
   - Choose "India"

6. **Take Aptitude Test**
   - Read instructions
   - Answer 30 questions
   - 30-minute timer
   - View score

7. **Browse Colleges**
   - Filter by location/type/fees
   - Check eligibility
   - View college details

---

## ✅ VERIFICATION

If everything works, you should be able to:

- ✅ Admin can login
- ✅ Admin can add/delete colleges
- ✅ Admin can add/delete questions
- ✅ Student can signup
- ✅ Student can complete profile
- ✅ Student can select career and location
- ✅ Student can take aptitude test
- ✅ Student can browse and filter colleges
- ✅ Student can see eligibility status

---

## 🚀 DEPLOY TO PRODUCTION

```powershell
# Build production version
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Get your live URL
# https://career-guidance-app.web.app
```

---

## 🐛 COMMON ISSUES

### "npm run dev" not working
```powershell
# Try:
npm install
npm run dev
```

### Firebase connection error
- Check `.env` file exists
- Verify all VITE_FIREBASE_* variables are set
- Restart server: `Ctrl+C` then `npm run dev`

### Can't login as admin
- Check Firestore → users collection → role = "admin"
- Check Authentication → user exists with same email

### No colleges showing
- Login as admin
- Add colleges in Admin Dashboard
- Logout and login as student

---

## 📁 PROJECT STRUCTURE

```
career_guidence/
├── src/
│   ├── components/    (Navbar, ProtectedRoute, CollegeCard)
│   ├── pages/         (Login, SignUp, Dashboards, Test, etc.)
│   ├── App.js         (Main routing)
│   ├── firebase.js    (Firebase config)
│   └── index.js       (Entry point)
├── public/
├── .env               (Firebase config - CREATE THIS!)
├── firebase.json      (Firebase hosting config)
├── firestore.rules    (Security rules)
├── package.json       (Dependencies)
└── vite.config.js     (Vite configuration)
```

---

## 📚 DOCUMENTATION FILES

- **FIREBASE_SETUP.md** - Detailed Firebase setup (11 steps)
- **README.md** - Project overview and features
- **PROJECT_REPORT.md** - Complete technical report
- **SETUP_GUIDE.md** - Development setup guide
- **COMMANDS_REFERENCE.md** - All CLI commands
- **PROJECT_CHECKLIST.md** - Verification checklist
- **QUICK_START.md** - This file!

---

## 🎓 FOR UNIFIED MENTOR SUBMISSION

1. **Create GitHub Repository**
   ```powershell
   git init
   git add .
   git commit -m "Career Guidance Application"
   git remote add origin your_repo_url
   git push -u origin main
   ```

2. **Deploy to Firebase**
   ```powershell
   npm run build
   firebase deploy
   ```

3. **Submit These:**
   - GitHub repository URL
   - Live deployment URL (https://your-app.web.app)
   - PROJECT_REPORT.md (included in repo)
   - Screenshots of application

---

## 🎉 YOU'RE DONE!

Your Career Guidance Application is now:
- ✅ Running locally
- ✅ Connected to Firebase
- ✅ Ready for testing
- ✅ Ready for deployment
- ✅ Ready for submission

**Need more details?** Check FIREBASE_SETUP.md for complete guide!

---

**Time to complete: ~10 minutes** ⏱️
