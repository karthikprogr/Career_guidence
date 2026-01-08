# 🎯 ALL COMMANDS IN ONE PLACE

Copy-paste these commands in order to get your app running!

---

## 📦 STEP 1: INSTALL DEPENDENCIES

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\career_guidence"
npm install
```

---

## 🔥 STEP 2: SETUP FIREBASE CLI

```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

A browser will open - sign in with Gmail and grant permissions.

---

## 🚀 STEP 3: INITIALIZE FIREBASE

```powershell
# Make sure you're in project directory
cd "c:\Users\DELL\OneDrive\Desktop\career_guidence"

# Initialize Firebase
firebase init
```

**Answer the prompts:**
- Features: Press Space to select **Firestore** and **Hosting**, then Enter
- Project: Select your project from list
- Firestore rules: Press Enter (use default)
- Firestore indexes: Press Enter (use default)
- Public directory: Type `dist` and press Enter
- Single-page app: Type `y` and press Enter
- Automatic builds: Type `n` and press Enter
- Overwrite index.html: Type `n` and press Enter

---

## 🔒 STEP 4: DEPLOY SECURITY RULES

```powershell
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

---

## ▶️ STEP 5: START DEVELOPMENT SERVER

```powershell
npm run dev
```

App will open at: **http://localhost:3000**

---

## 🏗️ STEP 6: BUILD FOR PRODUCTION

```powershell
npm run build
```

---

## 🌐 STEP 7: DEPLOY TO FIREBASE HOSTING

```powershell
firebase deploy
```

---

## 🔧 TROUBLESHOOTING COMMANDS

### Clear Cache and Reinstall
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Kill Process on Port 3000
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual PID from above)
taskkill /PID <PID> /F
```

### Check Installed Versions
```powershell
node --version
npm --version
firebase --version
```

### View Firebase Projects
```powershell
firebase projects:list
```

### Firebase Logout and Login
```powershell
firebase logout
firebase login
```

---

## 📊 MONITORING COMMANDS

### View Deployment Status
```powershell
firebase deploy --only hosting --debug
```

### View Firestore Rules
```powershell
firebase firestore:rules:get
```

### Test Firestore Rules Locally
```powershell
firebase emulators:start
```

---

## 🔄 GIT COMMANDS (FOR GITHUB)

```powershell
# Initialize Git repository
git init

# Add all files
git add .

# Commit
git commit -m "Career Guidance Application - Complete"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/career-guidance-app.git

# Push to GitHub
git push -u origin main
```

---

## 🧪 TESTING COMMANDS

### Run Vite in Different Port
```powershell
# Edit vite.config.js or use environment variable
$env:PORT=3001; npm run dev
```

### Preview Production Build Locally
```powershell
npm run preview
```

---

## 📦 UPDATE COMMANDS

### Update All Packages
```powershell
npm update
```

### Check for Outdated Packages
```powershell
npm outdated
```

### Update Specific Package
```powershell
npm update react
npm update firebase
```

---

## 🗑️ CLEANUP COMMANDS

### Remove Build Directory
```powershell
Remove-Item -Recurse -Force dist
```

### Clear npm Cache
```powershell
npm cache clean --force
```

---

## 🔐 FIREBASE SECURITY COMMANDS

### Deploy Only Rules
```powershell
firebase deploy --only firestore:rules
```

### Deploy Only Indexes
```powershell
firebase deploy --only firestore:indexes
```

### Deploy Everything
```powershell
firebase deploy
```

---

## 📱 DEVELOPMENT WORKFLOW

### Daily Development
```powershell
# 1. Start development server
npm run dev

# 2. Make changes to code

# 3. Test in browser (auto-reloads)

# 4. Build when ready
npm run build

# 5. Deploy to production
firebase deploy
```

---

## 🎯 ONE-COMMAND DEPLOY

Create a PowerShell script for easy deployment:

**deploy.ps1:**
```powershell
npm run build
firebase deploy
Write-Host "✅ Deployment complete!" -ForegroundColor Green
```

Run it:
```powershell
.\deploy.ps1
```

---

## 📋 QUICK REFERENCE

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `firebase login` | Login to Firebase |
| `firebase init` | Initialize Firebase |
| `firebase deploy` | Deploy to hosting |
| `firebase deploy --only firestore:rules` | Deploy only rules |
| `firebase projects:list` | List Firebase projects |

---

## 🚨 EMERGENCY COMMANDS

### App Not Starting?
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

### Firebase Not Connecting?
```powershell
firebase logout
firebase login
firebase use --add
```

### Port Already in Use?
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm run dev
```

---

## ✅ VERIFICATION COMMANDS

### Check if everything is installed
```powershell
node --version    # Should show v16+ or v18+
npm --version     # Should show 8+ or 9+
firebase --version # Should show 11+ or 12+
```

### Check if Firebase is connected
```powershell
firebase projects:list  # Should show your project
```

### Check if app runs
```powershell
npm run dev  # Should open http://localhost:3000
```

---

## 🎓 SUBMISSION CHECKLIST COMMANDS

```powershell
# 1. Build production version
npm run build

# 2. Deploy to Firebase
firebase deploy

# 3. Initialize Git
git init

# 4. Add all files
git add .

# 5. Commit
git commit -m "Career Guidance Application - UM Internship"

# 6. Push to GitHub
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

---

**🎉 That's it! All commands you need in one place!**

**Quick Start:** Run commands from STEP 1 to STEP 5, then you're done!
