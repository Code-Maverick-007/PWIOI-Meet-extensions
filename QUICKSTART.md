# 🚀 Quick Start Guide - PW Meet Engage

## 📦 Installation (5 minutes)

### Step 1: Build the Extension
```bash
npm install
npm run build
```

### Step 2: Load in Chrome
1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `dist/` folder
5. Done! 🎉

---

## 🧪 Test it Now (2 minutes)

### As Host (Teacher):
1. Open https://meet.google.com/ (start/join a meeting)
2. Click the **PW Meet Engage** extension icon
3. Click **"🚀 Start New Session"**
4. Click **"📊 Create New Poll"**
5. Fill in:
   - Question: "What is 2 + 2?"
   - Options: 2, 3, 4, 5
   - Select "4" as correct answer
6. Click **"Send Poll"**

### As Participant (Student):
1. Open the same Meet in an **incognito window** (or different browser)
2. A poll modal appears automatically! 🎯
3. Enter your name (e.g., "Alice")
4. Select an answer
5. Click **"Submit Answer"**
6. Watch the leaderboard appear (bottom-right)

### Test Multiple Participants:
- Open 2-3 more incognito windows
- Submit different answers with different names
- Watch the **Top 3 Leaderboard** update in real-time! 🏆

---

## ✅ What You Should See

### Host Popup:
- Session Active badge (green)
- Live response counter
- Top 3 leaderboard with scores

### Participant View (in Meet):
- Poll modal with question & options
- Success confirmation after submitting
- Floating leaderboard (bottom-right)

### Leaderboard Shows:
- 🥇 1st place
- 🥈 2nd place  
- 🥉 3rd place
- Total participant count

---

## 🛑 End Session

In the host popup, click **"End Session"** to:
- Clear all data
- Reset leaderboard
- Start fresh for next class

---

## ⚠️ Troubleshooting

**Poll not appearing?**
- Ensure you're on `meet.google.com/*`
- Check extension is enabled in `chrome://extensions/`
- Try reloading the Meet tab

**Extension icon greyed out?**
- Only works on Google Meet pages
- Open a Meet first, then click the icon

**Build failed?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## 🎯 Sample Poll Questions

Try these for testing:

**Quiz Mode:**
- "What is 5 × 3?" → [10, 15, 20, 25]
- "Capital of France?" → [Berlin, London, Paris, Rome]
- "2 + 2 = ?" → [3, 4, 5, 6]

**Opinion Poll:**
- "Best programming language?" → [Python, JavaScript, Java, Go]
- "Favorite color?" → [Red, Blue, Green, Yellow]

---

## 📚 Full Documentation

See [README.md](README.md) for:
- Complete architecture details
- Customization options
- Development guide
- API reference

---

**Ready to engage your class! 🎓✨**
