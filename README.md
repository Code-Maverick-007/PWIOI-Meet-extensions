# 🎓 PW Meet Engage

**A React-based Chrome Extension (Manifest V3)** designed exclusively for **Google Meet** that boosts engagement during live classes with real-time polls, quizzes, and leaderboards.

---

## 🎯 Features

### For Hosts (Teachers)
- ✅ Start/end engagement sessions
- ✅ Create polls or quizzes with 2-4 options
- ✅ Mark correct answers for scoring
- ✅ See live response counts
- ✅ View top 3 leaderboard in real-time

### For Participants (Students)
- ✅ Receive polls instantly in Google Meet
- ✅ Submit answers with their name
- ✅ See live leaderboard (top 3)
- ✅ Track total participants

### Session Management
- ✅ Data persists only during the session
- ✅ Automatic cleanup when session ends
- ✅ Works entirely locally (no backend required)

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chrome Extension Manifest V3** - Extension framework
- **chrome.storage.session** - Session data storage
- **chrome.runtime** - Message passing

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Google Chrome browser

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

### Step 3: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from this project
5. The extension icon should appear in your toolbar

---

## 🧪 Testing Instructions

### Test as Host (Teacher)

1. **Open Google Meet**
   - Go to https://meet.google.com/
   - Start or join a meeting

2. **Open Extension Popup**
   - Click the PW Meet Engage icon in your toolbar
   - You should see the Host Control Panel

3. **Start Session**
   - Click "🚀 Start New Session"
   - Session is now active

4. **Create a Poll**
   - Click "📊 Create New Poll"
   - Enter a question: "What is 2 + 2?"
   - Add options: "2", "3", "4", "5"
   - Select the radio button next to "4" (correct answer)
   - Click "Send Poll"

5. **View Responses**
   - The popup shows live response count
   - Leaderboard updates automatically

### Test as Participant (Student)

1. **Open Google Meet** (same meeting, different browser/incognito tab)
   - Or use the same tab to simulate a participant

2. **Poll Appears Automatically**
   - A modal overlay appears with the poll question
   - Select an option
   - Enter your name (e.g., "Alice")
   - Click "Submit Answer"

3. **See Confirmation**
   - Success message appears
   - Modal auto-closes after 2 seconds

4. **View Leaderboard**
   - Check bottom-right corner of Meet
   - Top 3 participants are shown with scores
   - Total participant count is displayed

### Test Multiple Participants

1. Open **2-3 incognito windows** with the same Meet link
2. Send a poll from the host tab
3. Submit answers from each participant tab with different names
4. Watch the leaderboard update in real-time

### End Session

1. Go back to host popup
2. Click "End Session"
3. All data clears
4. Leaderboard disappears from all tabs

---

## 📁 Project Structure

```
pwioi-meet/
├── manifest.json              # Extension manifest (Manifest V3)
├── package.json               # Dependencies
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── create-icons.js           # Icon placeholder generator
├── public/
│   ├── icon48.png           # Extension icon (48x48)
│   └── icon128.png          # Extension icon (128x128)
├── src/
│   ├── background.js        # Service worker (message routing)
│   ├── index.css            # Global styles with Tailwind
│   ├── popup/
│   │   ├── popup.html       # Popup HTML entry point
│   │   └── PopupApp.jsx     # Host control panel UI
│   ├── content/
│   │   ├── content.js       # Content script entry point
│   │   ├── PollViewer.jsx   # Poll modal for participants
│   │   └── Leaderboard.jsx  # Floating leaderboard widget
│   └── utils/
│       ├── messaging.js     # Chrome messaging helpers
│       └── storage.js       # Chrome storage helpers
└── dist/                    # Build output (created by npm run build)
```

---

## 🔄 How It Works

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Popup     │ ───────>│  Background  │ ───────>│   Content   │
│  (Host UI)  │  send   │   Service    │  send   │   Script    │
│             │  poll   │   Worker     │  poll   │ (Meet Page) │
└─────────────┘         └──────────────┘         └─────────────┘
       ↑                        ↑                        │
       │                        │                        │
       │                  forward answer            submit answer
       │                        │                        │
       └────────────────────────┴────────────────────────┘
```

### Message Flow

1. **Host creates poll** → Popup sends `NEW_POLL` to background
2. **Background broadcasts** → Sends poll to all Meet tabs
3. **Participant submits** → Content script sends `ANSWER_SUBMITTED`
4. **Background updates scores** → Saves to `chrome.storage.session`
5. **Background broadcasts leaderboard** → All tabs receive `LEADERBOARD_UPDATE`
6. **UI updates** → Leaderboard widget shows top 3

### Data Storage

All data stored in `chrome.storage.session`:

```js
{
  sessionActive: true,
  currentPoll: {
    question: "What is 2 + 2?",
    options: ["2", "3", "4", "5"],
    correct: 2
  },
  responses: {
    "Alice": 2,
    "Bob": 1
  },
  scores: {
    "Alice": 10,
    "Bob": 0
  }
}
```

---

## 🎨 UI Components

### Popup (Host)
- Gradient blue/purple background
- Session control buttons
- Dynamic poll creation form
- Live response counter
- Top 3 leaderboard

### Poll Modal (Participant)
- Full-screen overlay with backdrop blur
- Question display
- Radio-style option selection
- Name input field
- Success confirmation

### Leaderboard Widget
- Fixed bottom-right position
- Shows top 3 with medals (🥇🥈🥉)
- Total participant count
- Smooth animations

---

## 🧩 Customization

### Change Scoring System
Edit `src/background.js` line 30:
```js
scores[message.name] = (scores[message.name] || 0) + 10; // Change 10 to any value
```

### Modify Colors
Edit `tailwind.config.js` or component classes.

### Add More Options
Edit `src/popup/PopupApp.jsx` line 54:
```js
if (options.length < 4) { // Change 4 to allow more options
```

---

## 🐛 Troubleshooting

### Extension doesn't load
- Ensure you ran `npm run build`
- Check that you're loading the `dist/` folder, not the root
- Look for errors in `chrome://extensions/`

### Popup shows "Not a Google Meet Tab"
- Make sure you're on `https://meet.google.com/*`
- The extension only works on Meet pages

### Poll doesn't appear for participants
- Check browser console for errors
- Ensure background service worker is running (check in `chrome://extensions/`)
- Try reloading the Meet tab

### Leaderboard not updating
- Check that multiple participants have submitted answers
- Verify scores in Chrome DevTools:
  ```js
  chrome.storage.session.get(['scores'], console.log)
  ```

---

## 🚀 Future Enhancements

Potential features to add:

- [ ] Backend integration (Socket.IO + Supabase)
- [ ] Timer for timed quizzes
- [ ] Question history
- [ ] Export results as CSV
- [ ] Multiple question types (true/false, short answer)
- [ ] Participant avatars
- [ ] Sound effects
- [ ] Dark/light mode toggle
- [ ] Mobile app companion

---

## 📝 Development

### Run Development Build
```bash
npm run dev
```
Note: For extensions, you'll still need to manually reload in `chrome://extensions/` after changes.

### Watch Mode
Since Vite's dev server doesn't work with Chrome extensions, use:
```bash
npm run build -- --watch
```

### Debug
- Background script: `chrome://extensions/` → "Inspect views: service worker"
- Content script: Right-click on Meet page → "Inspect"
- Popup: Right-click extension icon → "Inspect popup"

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

## 🙏 Credits

Built with ❤️ for educators using Google Meet.

**Tech:** React, Vite, Tailwind CSS, Chrome Extensions API

---

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Verify you're on a Meet page
4. Ensure extension is enabled

---

## ✅ Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Build extension: `npm run build`
- [ ] Load in Chrome: `chrome://extensions/` → Load unpacked → Select `dist/`
- [ ] Open Google Meet
- [ ] Click extension icon
- [ ] Start session
- [ ] Create and send a poll
- [ ] Test from incognito window
- [ ] Watch leaderboard update
- [ ] End session

**You're ready to engage your class! 🎉**
