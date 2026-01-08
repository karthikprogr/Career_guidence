# 🚀 CAREER GUIDANCE APP - QUICK COMMANDS REFERENCE

All commands you need to setup, run, and deploy the Career Guidance Application.

---

## 📋 PREREQUISITES CHECK

```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 📥 INITIAL SETUP

```bash
# Clone repository (replace with your repo URL)
git clone https://github.com/yourusername/career-guidance-app.git

# Navigate to project directory
cd career-guidance-app

# Install dependencies
npm install

# Copy environment example
copy .env.example .env

# Open .env in editor and add Firebase credentials
notepad .env
```

---

## 🔥 FIREBASE SETUP

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# When prompted, select:
# - Firestore (Database)
# - Hosting

# Use existing project and select your Firebase project

# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

---

## ▶️ DEVELOPMENT COMMANDS

```bash
# Start development server
npm run dev
# Opens http://localhost:3000

# Start on different port
set PORT=3001 && npm run dev

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

---

## 🧪 TESTING COMMANDS

```bash
# Vite doesn't include test runner by default
# You can add Vitest if needed:
npm install -D vitest

# Then add to package.json scripts:
# "test": "vitest"
```

---

## 🚀 DEPLOYMENT COMMANDS

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only database rules
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy
```

---

## 🔧 MAINTENANCE COMMANDS

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clean install (if issues arise)
rmdir /s node_modules
del package-lock.json
npm install
```

---

## 📦 PACKAGE MANAGEMENT

```bash
# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Uninstall package
npm uninstall package-name

# List installed packages
npm list --depth=0
```

---

## 🔍 DEBUGGING COMMANDS

```bash
# Clear npm cache
npm cache clean --force

# Verify npm cache
npm cache verify

# Check React app health
npm run build
# Look for errors in terminal

# View Firebase logs
firebase functions:log

# Check Firebase hosting status
firebase hosting:channel:list
```

---

## 🌐 FIREBASE SPECIFIC COMMANDS

```bash
# List Firebase projects
firebase projects:list

# Switch Firebase project
firebase use project-id

# Open Firebase console
firebase open

# View Firestore data
firebase firestore:indexes

# Export Firestore data
firebase firestore:export gs://bucket-name

# Import Firestore data
firebase firestore:import gs://bucket-name/export-folder
```

---

## 🗄️ DATABASE COMMANDS

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# View Firestore rules
firebase firestore:rules get

# Validate Firestore rules
firebase firestore:rules validate
```

---

## 📊 MONITORING COMMANDS

```bash
# View hosting logs
firebase hosting:channel:list

# View app analytics
firebase apps:list

# Check deployment history
firebase hosting:channel:list
```

---

## 🔐 SECURITY COMMANDS

```bash
# Validate security rules
firebase firestore:rules validate

# Test security rules
firebase firestore:rules test

# Update security rules
firebase deploy --only firestore:rules
```

---

## 💾 GIT COMMANDS

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/username/repo.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Port Already in Use

```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID 12345 /F

# Or use different port
set PORT=3001 && npm run dev
```

### Module Not Found

```bash
# Clean install
rmdir /s node_modules
del package-lock.json
npm install
```

### Firebase Authentication Issues

```bash
# Re-login to Firebase
firebase logout
firebase login
```

### Build Errors

```bash
# Clear build cache
rmdir /s build
npm run build
```

---

## 📱 DEVELOPMENT WORKFLOW

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev

# 4. Make changes and test

# 5. Commit changes
git add .
git commit -m "Description of changes"

# 6. Push to GitHub
git push origin main
```

### Before Deployment

```bash
# 1. Test locally
npm run dev

# 2. Build production version
npm run build

# 3. Test production build
serve -s build

# 4. Deploy to Firebase
firebase deploy

# 5. Test live site
# Visit https://your-project-id.web.app
```

---

## 🎯 QUICK START (Complete Flow)

```bash
# 1. Clone and setup
git clone https://github.com/yourusername/career-guidance-app.git
cd career-guidance-app
npm install

# 2. Configure environment
copy .env.example .env
# Edit .env with Firebase credentials

# 3. Setup Firebase
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules

# 4. Start development
npm run dev

# 5. Build and deploy
npm run build
firebase deploy
```

---

## 📚 USEFUL LINKS

- **Firebase Console**: https://console.firebase.google.com/
- **React Docs**: https://react.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **npm Docs**: https://docs.npmjs.com/

---

## 🆘 EMERGENCY COMMANDS

### Complete Reset

```bash
# Delete everything and start fresh
rmdir /s node_modules
rmdir /s build
del package-lock.json
del .env
npm install
copy .env.example .env
# Edit .env
npm run dev
```

### Revert to Last Working Version

```bash
git log --oneline
git checkout <commit-hash>
npm install
npm run dev
```

### Force Deploy

```bash
firebase deploy --force
```

---

## 📝 NOTES

- Always run `npm install` after pulling changes
- Keep `.env` file updated with correct Firebase credentials
- Test locally before deploying to production
- Commit frequently with meaningful messages
- Deploy security rules after any changes to `firestore.rules`

---

## ✅ COMMAND CHECKLIST

### First Time Setup
- [ ] `git clone ...`
- [ ] `cd career-guidance-app`
- [ ] `npm install`
- [ ] `copy .env.example .env`
- [ ] Edit `.env` file
- [ ] `npm install -g firebase-tools`
- [ ] `firebase login`
- [ ] `firebase init`
- [ ] `firebase deploy --only firestore:rules`
- [ ] `npm run dev`

### Daily Development
- [ ] `git pull origin main`
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Make changes
- [ ] `git add .`
- [ ] `git commit -m "..."`
- [ ] `git push origin main`

### Deployment
- [ ] `npm run build`
- [ ] `firebase deploy`
- [ ] Test live site
- [ ] Verify all features work

---

**Quick Reference Complete! Save this file for easy access to all commands. 🚀**
