# 🚀 QUICK START GUIDE
## Career Guidance Web Application

Follow these steps to get the application running on your local machine.

---

## ⚡ Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Firebase Account** - [Create Free Account](https://firebase.google.com/)
- ✅ **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 📥 Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/yourusername/career-guidance-app.git
cd career-guidance-app
```

---

## 📦 Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Firebase 10.7.1
- Other dependencies

---

## 🔥 Step 3: Firebase Setup

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `career-guidance-app`
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

### 3.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get Started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **"Save"**

### 3.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location: **us-central** (or nearest to you)
5. Click **"Enable"**

### 3.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click the **Web icon** (</>)
4. Register app with nickname: `career-guidance-web`
5. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

---

## 🔐 Step 4: Configure Environment Variables

1. Copy the example environment file:

```bash
copy .env.example .env
```

2. Open `.env` file and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ **Important**: Never commit `.env` file to Git!

---

## 🔒 Step 5: Deploy Security Rules

### 5.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 5.2 Login to Firebase

```bash
firebase login
```

### 5.3 Initialize Firebase

```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Hosting

Press Space to select, Enter to confirm.

### 5.4 Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

This will deploy the security rules from `firestore.rules` file.

---

## ▶️ Step 6: Start the Application

Start the development server:

```bash
npm run dev
```

The application will automatically open in your browser at:

```
http://localhost:3000
```

---

## 🧪 Step 7: Test the Application

### Create Admin Account

1. Go to `http://localhost:3000`
2. Click **"Sign Up"**
3. Fill in details:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: **Admin**
4. Click **"Sign Up"**

### Create Student Account

1. Logout from admin account
2. Click **"Sign Up"**
3. Fill in details:
   - Name: Student User
   - Email: student@example.com
   - Password: student123
   - Role: **Student**
4. Click **"Sign Up"**

### Test Admin Features

1. Login as admin
2. Add a sample college:
   - Name: Sample College
   - Location: India
   - Type: Engineering
   - Fees: 200000
   - Ranking: 1
   - Min CGPA: 7.0
   - Placement Rate: 85
3. Add sample aptitude questions (at least 10 in each category)

### Test Student Features

1. Login as student
2. Complete profile
3. Select career and location
4. Take aptitude test
5. Browse colleges

---

## 🚀 Step 8: Deploy to Production (Optional)

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy
```

Your app will be live at:
```
https://your-project-id.web.app
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution**: Kill the process or use a different port:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: Firebase not initialized

**Solution**: Check if `.env` file exists and has correct values

### Issue: Firestore permission denied

**Solution**: Deploy security rules:

```bash
firebase deploy --only firestore:rules
```

### Issue: Module not found

**Solution**: Delete `node_modules` and reinstall:

```bash
rmdir /s node_modules
npm install
```

---

## 📁 Project Structure

```
career-guidance-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   └── CollegeCard.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── SignUp.js
│   │   ├── StudentDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── CareerSelection.js
│   │   ├── LocationSelection.js
│   │   ├── StudentDetails.js
│   │   ├── CollegeList.js
│   │   ├── CollegeDetails.js
│   │   ├── AptitudeTest.js
│   │   └── TestCompletion.js
│   ├── App.js
│   ├── firebase.js
│   ├── logger.js
│   └── index.js
├── .env
├── .gitignore
├── firebase.json
├── firestore.rules
├── package.json
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Add more colleges (Admin Dashboard)
2. ✅ Add aptitude questions (minimum 30 questions)
3. ✅ Test all features thoroughly
4. ✅ Customize styling as needed
5. ✅ Deploy to production
6. ✅ Share with users

---

## 📞 Need Help?

- 📖 Check [README.md](README.md) for detailed documentation
- 📄 Review [PROJECT_REPORT.md](PROJECT_REPORT.md) for technical details
- 🐛 Report issues on GitHub
- 📧 Contact: your.email@example.com

---

## ✅ Checklist

Before considering setup complete:

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Environment variables configured
- [ ] Security rules deployed
- [ ] Application starts without errors
- [ ] Admin account created and tested
- [ ] Student account created and tested
- [ ] At least one college added
- [ ] At least 30 questions added
- [ ] Aptitude test works
- [ ] College filtering works

---

**Congratulations! Your Career Guidance Application is now running! 🎉**

---

## 📸 Expected Results

### After Setup, You Should See:

1. **Login Page**: Clean authentication interface
2. **Student Dashboard**: Overview of profile, test, and colleges
3. **Admin Dashboard**: College and question management
4. **Aptitude Test**: 30-minute timer with questions
5. **College List**: Filterable list of colleges

---

**Setup Time**: 15-30 minutes
**Difficulty**: Medium
**Support**: Available via GitHub Issues

---

*Made with ❤️ for Unified Mentor Internship*
