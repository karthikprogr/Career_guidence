# 🎯 COMPLETE SETUP - START TO FINISH

## 📍 YOU ARE HERE: c:\Users\DELL\OneDrive\Desktop\career_guidence

Follow these steps in exact order. Total time: ~15 minutes.

---

## ✅ PHASE 1: INSTALL & SETUP (5 minutes)

### 1. Install Dependencies

Open PowerShell and run:

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\career_guidence"
npm install
```

⏳ Wait 2-3 minutes for installation...

✅ **Expected**: Should install 1500+ packages without errors

---

### 2. Create Firebase Project

1. **Open browser**: https://console.firebase.google.com/
2. **Sign in** with your Gmail
3. **Click** "Add project"
4. **Enter name**: `career-guidance-app`
5. **Disable** Google Analytics (optional)
6. **Click** "Create project"
7. **Wait** 30-60 seconds
8. **Click** "Continue"

✅ **You should see**: Firebase Console Dashboard

---

### 3. Enable Authentication

1. **Click** "Authentication" in left sidebar
2. **Click** "Get started"
3. **Click** "Email/Password"
4. **Toggle** "Enable" to ON
5. **Click** "Save"

✅ **You should see**: Green checkmark next to Email/Password

---

### 4. Create Firestore Database

1. **Click** "Firestore Database" in left sidebar
2. **Click** "Create database"
3. **Select** "Start in production mode"
4. **Click** "Next"
5. **Choose location**: `asia-south1` (or closest to you)
6. **Click** "Enable"
7. **Wait** 30-60 seconds

✅ **You should see**: Empty Firestore Database screen

---

### 5. Get Firebase Configuration

1. **Click** gear icon ⚙️ next to "Project Overview"
2. **Click** "Project settings"
3. **Scroll down** to "Your apps" section
4. **Click** the Web icon `</>` button
5. **Enter nickname**: `Career Guidance App`
6. **DON'T** check "Also set up Firebase Hosting"
7. **Click** "Register app"

8. **COPY these 6 values** (keep this window open):
   ```
   apiKey: "AIzaSy..."
   authDomain: "career-guidance-app.firebaseapp.com"
   projectId: "career-guidance-app"
   storageBucket: "career-guidance-app.appspot.com"
   messagingSenderId: "123456..."
   appId: "1:123456..."
   ```

✅ **You should see**: Firebase SDK configuration code

---

### 6. Create .env File

1. **Open** `c:\Users\DELL\OneDrive\Desktop\career_guidence` folder
2. **Create new file** named `.env` (with dot at start)
3. **Paste this** and replace with YOUR values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=career-guidance-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=career-guidance-app
VITE_FIREBASE_STORAGE_BUCKET=career-guidance-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123456...
```

⚠️ **IMPORTANT**:
- No spaces around `=` signs
- Replace ALL values with your actual Firebase config
- File must be named exactly `.env` (not `.env.txt`)

✅ **Verify**: Open `.env` file and check all 6 values are correct

---

## ✅ PHASE 2: FIREBASE CLI SETUP (3 minutes)

### 7. Install Firebase CLI

```powershell
npm install -g firebase-tools
```

⏳ Wait 1-2 minutes...

✅ **Verify**:
```powershell
firebase --version
```
Should show version 12.x.x or higher

---

### 8. Login to Firebase

```powershell
firebase login
```

- Browser window will open automatically
- **Sign in** with the same Gmail account
- **Click** "Allow" to grant permissions
- **Return** to PowerShell

✅ **You should see**: "✔ Success! Logged in as your@email.com"

---

### 9. Initialize Firebase Project

```powershell
firebase init
```

**Answer these prompts EXACTLY:**

```
? Which Firebase features do you want to set up?
  → Press Space to select: Firestore, Hosting
  → Press Enter

? Please select an option:
  → Use an existing project
  → Press Enter

? Select a default Firebase project:
  → Choose your project (career-guidance-app)
  → Press Enter

? What file should be used for Firestore Rules?
  → Press Enter (use default: firestore.rules)

? What file should be used for Firestore indexes?
  → Press Enter (use default: firestore.indexes.json)

? What do you want to use as your public directory?
  → Type: dist
  → Press Enter

? Configure as a single-page app (rewrite all urls to /index.html)?
  → Type: y
  → Press Enter

? Set up automatic builds and deploys with GitHub?
  → Type: n
  → Press Enter

? File dist/index.html already exists. Overwrite?
  → Type: n
  → Press Enter
```

✅ **You should see**: "✔ Firebase initialization complete!"

---

### 10. Deploy Firestore Rules

```powershell
firebase deploy --only firestore:rules
```

⏳ Wait 10-20 seconds...

✅ **You should see**: "✔ Deploy complete!"

```powershell
firebase deploy --only firestore:indexes
```

⏳ Wait 10-20 seconds...

✅ **You should see**: "✔ Deploy complete!"

---

## ✅ PHASE 3: CREATE ADMIN ACCOUNT (2 minutes)

### 11. Create Admin in Firebase Console

**Step A: Create Auth User**

1. **Go to**: Firebase Console → Authentication → Users tab
2. **Click** "Add user"
3. **Enter**:
   - Email: `admin@test.com`
   - Password: `admin123`
4. **Click** "Add user"
5. **COPY the User UID** (looks like: abc123def456...)

**Step B: Create Firestore Document**

1. **Go to**: Firebase Console → Firestore Database
2. **Click** "Start collection"
3. **Collection ID**: `users`
4. **Click** "Next"
5. **Document ID**: Paste the User UID you copied
6. **Add these fields**:
   - Field: `email` | Type: string | Value: `admin@test.com`
   - Field: `name` | Type: string | Value: `Admin User`
   - Field: `role` | Type: string | Value: `admin`
   - Field: `createdAt` | Type: timestamp | Value: (click current timestamp)
7. **Click** "Save"

✅ **Verify**: You should see 1 document in `users` collection with role="admin"

---

## ✅ PHASE 4: RUN THE APP (1 minute)

### 12. Start Development Server

```powershell
npm run dev
```

⏳ Wait 5-10 seconds...

✅ **You should see**:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Browser should auto-open** to http://localhost:3000

---

## ✅ PHASE 5: TEST ADMIN LOGIN (1 minute)

### 13. Login as Admin

1. **Browser** should show Career Guidance App
2. **Click** "Login" button
3. **Enter**:
   - Email: `admin@test.com`
   - Password: `admin123`
4. **Click** "Login"

✅ **You should see**: Admin Dashboard with "Colleges" and "Questions" tabs

---

## ✅ PHASE 6: ADD SAMPLE DATA (3 minutes)

### 14. Add Colleges (Admin Dashboard)

**Click** "Colleges" tab → **Click** "Add College"

**Add College #1:**
```
Name: IIT Delhi
Location: India
Type: Government
Fees: 200000
Ranking: 1
Min CGPA: 8.5
Placement Rate: 95
```
**Click** "Add College"

**Add College #2:**
```
Name: MIT
Location: Abroad
Type: Private
Fees: 5000000
Ranking: 1
Min CGPA: 9.0
Placement Rate: 98
```
**Click** "Add College"

**Add College #3:**
```
Name: Stanford University
Location: Abroad
Type: Private
Fees: 4500000
Ranking: 2
Min CGPA: 8.8
Placement Rate: 96
```
**Click** "Add College"

✅ **You should see**: 3 colleges displayed in grid

---

### 15. Add Questions (Admin Dashboard)

**Click** "Questions" tab → **Click** "Add Question"

**Add 10 Verbal Questions:**

1. Question: `What is the synonym of "Happy"?`
   - Option A: Sad
   - Option B: Joyful ✓
   - Option C: Angry
   - Option D: Tired
   - Correct: B
   - Category: Verbal

2. Question: `What is the antonym of "Big"?`
   - Option A: Large
   - Option B: Huge
   - Option C: Small ✓
   - Option D: Giant
   - Correct: C
   - Category: Verbal

3. Question: `Complete the sentence: She ___ to school every day.`
   - Option A: Go
   - Option B: Goes ✓
   - Option C: Going
   - Option D: Gone
   - Correct: B
   - Category: Verbal

Add 7 more similar questions...

**Add 10 Quantitative Questions:**

1. Question: `What is 2 + 2?`
   - Option A: 3
   - Option B: 4 ✓
   - Option C: 5
   - Option D: 6
   - Correct: B
   - Category: Quantitative

2. Question: `What is 10 × 5?`
   - Option A: 15
   - Option B: 20
   - Option C: 50 ✓
   - Option D: 100
   - Correct: C
   - Category: Quantitative

3. Question: `What is √16?`
   - Option A: 2
   - Option B: 4 ✓
   - Option C: 8
   - Option D: 16
   - Correct: B
   - Category: Quantitative

Add 7 more similar questions...

**Add 10 General Knowledge Questions:**

1. Question: `What is the capital of India?`
   - Option A: Mumbai
   - Option B: Kolkata
   - Option C: New Delhi ✓
   - Option D: Chennai
   - Correct: C
   - Category: General Knowledge

2. Question: `Who invented the computer?`
   - Option A: Thomas Edison
   - Option B: Charles Babbage ✓
   - Option C: Albert Einstein
   - Option D: Isaac Newton
   - Correct: B
   - Category: General Knowledge

3. Question: `What is the largest planet in our solar system?`
   - Option A: Earth
   - Option B: Mars
   - Option C: Jupiter ✓
   - Option D: Saturn
   - Correct: C
   - Category: General Knowledge

Add 7 more similar questions...

✅ **You should see**: 30 questions total (10 per category)

---

## ✅ PHASE 7: TEST STUDENT FLOW (5 minutes)

### 16. Create Student Account

1. **Click** profile icon → **Logout**
2. **Click** "Sign Up"
3. **Enter**:
   - Name: `Test Student`
   - Email: `student@test.com`
   - Password: `test123`
   - Role: **Student** (select from dropdown)
4. **Click** "Sign Up"
5. **You should auto-login** and see Student Dashboard

✅ **You should see**: Student Dashboard with incomplete profile warning

---

### 17. Complete Student Profile

1. **Click** "Complete Profile" button
2. **Fill in**:
   - CGPA: `8.0`
   - JEE Score: `85`
   - NEET Score: `0` (leave if not applicable)
   - CAT Score: `0`
   - GMAT Score: `0`
   - Other Exam Score: `0`
   - Phone: `9876543210`
   - Date of Birth: `2005-01-01`
   - Address: `123 Test Street, Test City`
3. **Click** "Save Profile"

✅ **You should see**: Success message and redirected to dashboard

---

### 18. Select Career

1. **Click** "Select Career Path" from dashboard
2. **Click** "Engineering" card
3. **Click** "Proceed"

✅ **You should see**: Success message

---

### 19. Select Location

1. **Click** "Choose Location" from dashboard
2. **Click** "India" or "Abroad" card
3. **Click** "Proceed"

✅ **You should see**: Success message

---

### 20. Take Aptitude Test

1. **Click** "Take Test" from dashboard
2. **Read** instructions
3. **Click** "Start Test"
4. **Answer** 30 questions (select any answers)
5. **Watch** the 30-minute timer countdown
6. **Click** "Submit Test"

✅ **You should see**: Test completion page with your score

---

### 21. Browse Colleges

1. **Click** "Browse Colleges" from dashboard
2. **See** list of colleges with eligibility status
3. **Try filters**:
   - Filter by Location: India/Abroad
   - Filter by Type: Government/Private
   - Filter by Fees: 0-1000000
   - Filter by Ranking: 1-10
4. **Click** on a college card to view details

✅ **You should see**: College details page with eligibility banner

---

## 🎉 CONGRATULATIONS!

Your Career Guidance Application is now:
- ✅ **Installed** with all dependencies
- ✅ **Connected** to Firebase
- ✅ **Running** at http://localhost:3000
- ✅ **Tested** with admin and student flows
- ✅ **Ready** for deployment

---

## 📊 WHAT YOU HAVE NOW

### Backend (Firebase)
- ✅ Authentication enabled
- ✅ Firestore database created
- ✅ Security rules deployed
- ✅ Admin account created
- ✅ Sample data added (3 colleges, 30 questions)

### Frontend (React + Vite)
- ✅ Development server running
- ✅ Admin dashboard working
- ✅ Student registration working
- ✅ Profile completion working
- ✅ Career/Location selection working
- ✅ Aptitude test working
- ✅ College browsing working

---

## 🚀 NEXT STEPS

### For Development
```powershell
# Stop server: Ctrl+C
# Start server: npm run dev
# Access app: http://localhost:3000
```

### For Production Deployment
```powershell
# Build production version
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Your live URL will be shown:
# https://career-guidance-app.web.app
```

### For GitHub
```powershell
git init
git add .
git commit -m "Career Guidance Application - Complete"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

---

## 📚 DOCUMENTATION REFERENCE

| File | Purpose |
|------|---------|
| **QUICK_START.md** | 10-minute quick start guide |
| **FIREBASE_SETUP.md** | Detailed Firebase setup (11 steps) |
| **ALL_COMMANDS.md** | All CLI commands in one place |
| **README.md** | Project overview and features |
| **PROJECT_REPORT.md** | Technical report for submission |
| **SETUP_GUIDE.md** | Development environment setup |
| **COMMANDS_REFERENCE.md** | Comprehensive command reference |
| **PROJECT_CHECKLIST.md** | Verification checklist |

---

## 🐛 TROUBLESHOOTING

### App not starting?
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Firebase connection error?
- Check `.env` file exists
- Verify all VITE_FIREBASE_* variables are set
- Restart dev server

### Can't login as admin?
- Check Firestore → users → role = "admin"
- Check Authentication → user exists

---

## 📞 NEED HELP?

1. **Firebase Console**: https://console.firebase.google.com/
2. **Check .env file** has correct values
3. **Check browser console** for errors (F12)
4. **Restart dev server**: Ctrl+C, then `npm run dev`

---

## ✅ FINAL VERIFICATION

Run through this checklist:

- [ ] `npm run dev` starts without errors
- [ ] App opens at http://localhost:3000
- [ ] Admin can login with admin@test.com
- [ ] Admin can add/delete colleges
- [ ] Admin can add/delete questions
- [ ] Student can sign up
- [ ] Student can complete profile
- [ ] Student can select career and location
- [ ] Student can take aptitude test (30 min timer works)
- [ ] Student can browse colleges with filters
- [ ] Student can see eligibility status
- [ ] College details page shows all information

---

**🎯 Total Setup Time: ~15 minutes**
**🎓 Ready for: Development, Testing, Deployment, Submission**

**🎉 YOUR CAREER GUIDANCE APPLICATION IS LIVE!**
