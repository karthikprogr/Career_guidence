# 🔥 COMPLETE FIREBASE SETUP GUIDE

Follow these steps carefully to connect your Career Guidance Application to Firebase.

---

## 📋 PREREQUISITES

- Node.js installed (v16+)
- npm installed
- Gmail account
- Internet connection

---

## 🚀 STEP-BY-STEP FIREBASE SETUP

### STEP 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Gmail account

2. **Create New Project**
   - Click **"Add project"** or **"Create a project"**
   - Enter project name: `career-guidance-app` (or any name you prefer)
   - Click **"Continue"**

3. **Google Analytics (Optional)**
   - Toggle OFF if you don't need analytics
   - Click **"Create project"**
   - Wait for project creation (takes 30-60 seconds)
   - Click **"Continue"** when done

---

### STEP 2: Enable Firebase Authentication

1. **Navigate to Authentication**
   - In Firebase Console, click **"Authentication"** from left sidebar
   - Click **"Get started"**

2. **Enable Email/Password Authentication**
   - Click on **"Sign-in method"** tab
   - Find **"Email/Password"** in the list
   - Click on it
   - Toggle **"Enable"** to ON
   - Click **"Save"**

---

### STEP 3: Create Firestore Database

1. **Navigate to Firestore Database**
   - Click **"Firestore Database"** from left sidebar
   - Click **"Create database"**

2. **Choose Database Mode**
   - Select **"Start in production mode"**
   - Click **"Next"**

3. **Select Location**
   - Choose closest location (e.g., `asia-south1` for India)
   - Click **"Enable"**
   - Wait for database creation (30-60 seconds)

---

### STEP 4: Get Firebase Configuration

1. **Add Web App**
   - In Firebase Console, click the **gear icon ⚙️** (Project settings) near "Project Overview"
   - Scroll down to "Your apps" section
   - Click the **Web icon `</>`** (Register app)

2. **Register Your App**
   - Enter app nickname: `Career Guidance Web App`
   - ❌ Don't check "Also set up Firebase Hosting" (we'll do it later)
   - Click **"Register app"**

3. **Copy Firebase Configuration**
   - You'll see code like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD...",
     authDomain: "career-guidance-app.firebaseapp.com",
     projectId: "career-guidance-app",
     storageBucket: "career-guidance-app.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```
   - **Keep this page open** or copy these values to Notepad

---

### STEP 5: Configure Environment Variables

1. **Create .env File**
   - Open your project folder: `c:\Users\DELL\OneDrive\Desktop\career_guidence`
   - Create a new file named `.env` (with the dot at the beginning)

2. **Add Firebase Configuration**
   - Copy the following template and replace values with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD...your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=career-guidance-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=career-guidance-app
   VITE_FIREBASE_STORAGE_BUCKET=career-guidance-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
   ```

3. **Save the File**
   - Make sure there are NO spaces around the `=` signs
   - Make sure the file is named exactly `.env` (not `.env.txt`)

---

### STEP 6: Install Firebase CLI

1. **Open PowerShell/Terminal**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```powershell
   firebase login
   ```
   - A browser window will open
   - Sign in with the same Gmail account
   - Grant permissions
   - Return to terminal

3. **Verify Login**
   ```powershell
   firebase projects:list
   ```
   - You should see your `career-guidance-app` project

---

### STEP 7: Initialize Firebase in Project

1. **Navigate to Project Directory**
   ```powershell
   cd "c:\Users\DELL\OneDrive\Desktop\career_guidence"
   ```

2. **Initialize Firebase**
   ```powershell
   firebase init
   ```

3. **Follow the Prompts**
   - **Which Firebase features?** → Press `Space` to select:
     - ✅ Firestore
     - ✅ Hosting
   - Press `Enter` to continue

   - **Use existing project** → Select `career-guidance-app`

   - **Firestore rules file?** → Press `Enter` (use default: firestore.rules)
   
   - **Firestore indexes file?** → Press `Enter` (use default: firestore.indexes.json)

   - **What do you want to use as your public directory?** → Type `dist` and press `Enter`

   - **Configure as single-page app?** → Type `y` and press `Enter`

   - **Set up automatic builds?** → Type `n` and press `Enter`

   - **Overwrite index.html?** → Type `n` and press `Enter`

---

### STEP 8: Deploy Firestore Rules

1. **Deploy Security Rules**
   ```powershell
   firebase deploy --only firestore:rules
   ```

2. **Deploy Indexes**
   ```powershell
   firebase deploy --only firestore:indexes
   ```

3. **Verify Deployment**
   - You should see: ✔ Deploy complete!

---

### STEP 9: Create Admin User

You need to manually create the first admin account in Firestore:

1. **Go to Firebase Console → Firestore Database**

2. **Create 'users' Collection**
   - Click **"Start collection"**
   - Collection ID: `users`
   - Click **"Next"**

3. **Add Admin Document**
   - Document ID: Click **"Auto-ID"** (or use a custom ID)
   - Add fields:
     ```
     email: "admin@example.com"
     name: "Admin User"
     role: "admin"
     createdAt: [Click "+" → Select "timestamp" → Click "Current timestamp"]
     ```
   - Click **"Save"**

4. **Create Admin Auth Account**
   - Go to **Authentication → Users**
   - Click **"Add user"**
   - Email: `admin@example.com` (same as above)
   - Password: Create a strong password (remember it!)
   - Click **"Add user"**
   - **Copy the User UID**

5. **Update Admin Document with UID**
   - Go back to **Firestore Database**
   - Find the admin document you created
   - Click **"Edit document"** (pencil icon)
   - Change Document ID to the copied User UID
   - Or add a field: `uid: "the_copied_uid"`
   - Click **"Update"**

---

## ✅ STEP 10: Test the Application

1. **Install Dependencies**
   ```powershell
   npm install
   ```

2. **Start Development Server**
   ```powershell
   npm run dev
   ```

3. **Open Browser**
   - Go to: http://localhost:3000

4. **Test Admin Login**
   - Click "Login"
   - Enter admin email and password
   - You should be redirected to Admin Dashboard

5. **Add Sample College**
   - In Admin Dashboard, go to "Colleges" tab
   - Click "Add College"
   - Fill in details:
     ```
     Name: IIT Delhi
     Location: India
     Type: Government
     Fees: 200000
     Ranking: 1
     Min CGPA: 8.5
     Placement Rate: 95
     ```
   - Click "Add College"

6. **Add Sample Questions**
   - Go to "Questions" tab
   - Add 3-5 questions in each category (Verbal, Quantitative, General Knowledge)
   - Format:
     ```
     Question: What is 2+2?
     Option A: 3
     Option B: 4 (correct)
     Option C: 5
     Option D: 6
     Category: Quantitative
     ```

7. **Test Student Flow**
   - Logout from Admin
   - Click "Sign Up"
   - Create student account:
     ```
     Name: Test Student
     Email: student@test.com
     Password: test123
     Role: Student
     ```
   - Complete profile → Select career → Select location → Take aptitude test → Browse colleges

---

## 🌐 STEP 11: Deploy to Production (Optional)

1. **Build Production Bundle**
   ```powershell
   npm run build
   ```

2. **Deploy to Firebase Hosting**
   ```powershell
   firebase deploy
   ```

3. **Get Live URL**
   - After deployment, you'll see:
     ```
     Hosting URL: https://career-guidance-app.web.app
     ```
   - Open this URL to access your live application

---

## 🔒 FIRESTORE SECURITY RULES EXPLAINED

Your `firestore.rules` file contains these security rules:

```javascript
// Users can read their own data
match /users/{userId} {
  allow read: if isAuthenticated() && request.auth.uid == userId;
  allow write: if isAuthenticated() && request.auth.uid == userId;
}

// Students can manage their profile
match /students/{studentId} {
  allow read: if isAuthenticated() && (isStudent() || isAdmin());
  allow create: if isAuthenticated() && isStudent();
  allow update, delete: if isAuthenticated() && 
    (request.auth.uid == studentId || isAdmin());
}

// Only admins can manage colleges
match /colleges/{collegeId} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && isAdmin();
}

// Only admins can manage questions
match /questions/{questionId} {
  allow read: if isAuthenticated() && isStudent();
  allow write: if isAuthenticated() && isAdmin();
}
```

---

## 📊 FIRESTORE DATABASE STRUCTURE

Your database will have these collections:

```
career-guidance-app (Firestore Database)
│
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── role: "admin" | "student"
│       └── createdAt: timestamp
│
├── students/
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       ├── cgpa: number
│       ├── examScores: object
│       ├── phone: string
│       ├── dateOfBirth: string
│       ├── address: string
│       ├── preferences: object
│       ├── profileCompleted: boolean
│       ├── aptitudeScore: number
│       └── createdAt: timestamp
│
├── colleges/
│   └── {collegeId}
│       ├── name: string
│       ├── location: "India" | "Abroad"
│       ├── type: "Government" | "Private"
│       ├── fees: number
│       ├── ranking: number
│       ├── minCGPA: number
│       ├── placementRate: number
│       ├── about: string
│       ├── facilities: array
│       └── createdAt: timestamp
│
├── questions/
│   └── {questionId}
│       ├── question: string
│       ├── options: object { a, b, c, d }
│       ├── correctAnswer: "a" | "b" | "c" | "d"
│       ├── category: "Verbal" | "Quantitative" | "General Knowledge"
│       └── createdAt: timestamp
│
├── testResults/
│   └── {resultId}
│       ├── userId: string
│       ├── score: number
│       ├── totalQuestions: number
│       ├── correctAnswers: number
│       ├── answers: array
│       └── completedAt: timestamp
│
└── logs/
    └── {logId}
        ├── level: "INFO" | "ERROR" | "SUCCESS" | "WARNING"
        ├── action: string
        ├── message: string
        ├── userId: string
        ├── userAgent: string
        ├── url: string
        └── timestamp: timestamp
```

---

## 🐛 TROUBLESHOOTING

### Error: "Firebase configuration not found"
- Check if `.env` file exists in project root
- Verify all `VITE_FIREBASE_*` variables are set
- Restart dev server: Stop with `Ctrl+C`, then run `npm run dev` again

### Error: "Permission denied" in Firestore
- Make sure you deployed security rules: `firebase deploy --only firestore:rules`
- Check if user has correct role in `users` collection
- Verify user is logged in

### Error: "No admin account found"
- Follow Step 9 to create admin user manually
- Make sure role is set to "admin" (lowercase)
- Ensure email matches between Authentication and Firestore

### Error: "Build fails"
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run: `npm install`
- Try again: `npm run build`

### Error: "Port 3000 already in use"
- Find and kill the process:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <PID_NUMBER> /F
  ```
- Or use different port in `vite.config.js`

---

## 📝 IMPORTANT NOTES

1. **Never commit `.env` file to Git** - It contains sensitive keys
2. **Keep Firebase API keys secure** - Don't share them publicly
3. **Backup Firestore data regularly** - Use Firebase Console export feature
4. **Monitor usage** - Check Firebase Console for quota limits
5. **Update security rules** - Review and test regularly

---

## ✅ VERIFICATION CHECKLIST

Before considering setup complete, verify:

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] `.env` file configured with correct values
- [ ] Firebase CLI installed and logged in
- [ ] Firestore rules deployed
- [ ] Admin account created in Firestore
- [ ] Admin can login successfully
- [ ] App runs at http://localhost:3000
- [ ] Student signup works
- [ ] College and question CRUD works for admin
- [ ] Student can complete profile and take test

---

## 🎯 NEXT STEPS AFTER SETUP

1. **Add More Sample Data**
   - Add at least 10-15 colleges
   - Add 30+ questions (10 per category)

2. **Test All Features**
   - Student registration and login
   - Profile completion
   - Career and location selection
   - Aptitude test with timer
   - College filtering and eligibility

3. **Deploy to Production**
   - Run `npm run build`
   - Run `firebase deploy`
   - Test live URL

4. **Documentation**
   - Take screenshots of each page
   - Update README.md with screenshots
   - Create demo video (optional)

5. **Submit to Unified Mentor**
   - GitHub repository URL
   - Live deployment URL
   - PROJECT_REPORT.md
   - Screenshots/demo video

---

## 📞 NEED HELP?

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com/
- **Vite Documentation**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/

---

**🎉 Congratulations! Your Career Guidance Application is now connected to Firebase!**
