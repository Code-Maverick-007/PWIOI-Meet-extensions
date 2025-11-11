import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PollViewer from './PollViewer.jsx';
import Leaderboard from './Leaderboard.jsx';
import '../index.css';

function ContentApp() {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [showPoll, setShowPoll] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    // Listen for messages from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received:', message);

      if (message.type === 'NEW_POLL') {
        setCurrentPoll(message.poll);
        setShowPoll(true);
      }

      if (message.type === 'LEADERBOARD_UPDATE') {
        setLeaderboard(message.leaderboard);
        setTotalParticipants(message.totalParticipants);
      }

      if (message.type === 'SESSION_ENDED') {
        setCurrentPoll(null);
        setShowPoll(false);
        setLeaderboard([]);
        setTotalParticipants(0);
      }

      sendResponse({ received: true });
      return true;
    });
  }, []);

  const handleSubmit = (name, answer) => {
    chrome.runtime.sendMessage({
      type: 'ANSWER_SUBMITTED',
      name,
      answer,
    });
  };

  const handleClose = () => {
    setShowPoll(false);
  };

  return (
    <>
      {showPoll && currentPoll && (
        <PollViewer
          poll={currentPoll}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
      
      <Leaderboard
        leaderboard={leaderboard}
        totalParticipants={totalParticipants}
      />
    </>
  );
}

// Create a container for the React app
const container = document.createElement('div');
container.id = 'pw-meet-engage-root';
container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';

// Make interactive elements pointer-events: auto
const style = document.createElement('style');
style.textContent = `
  #pw-meet-engage-root > * {
    pointer-events: auto;
  }
`;
document.head.appendChild(style);

document.body.appendChild(container);

// Mount the React app
const root = createRoot(container);
root.render(<ContentApp />);

console.log('PW Meet Engage content script loaded');
