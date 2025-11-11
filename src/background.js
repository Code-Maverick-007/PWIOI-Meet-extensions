// Background service worker for PW Meet Engage
// Handles message routing between popup (host) and content scripts (participants)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received:', message);

  if (message.type === 'NEW_POLL') {
    // Broadcast poll to all Meet tabs
    chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          console.log('Could not send to tab:', tab.id);
        });
      });
    });
    sendResponse({ success: true });
  }

  if (message.type === 'ANSWER_SUBMITTED') {
    // Forward answer to host popup and update storage
    chrome.storage.session.get(['responses', 'scores', 'currentPoll'], (data) => {
      const responses = data.responses || {};
      const scores = data.scores || {};
      const currentPoll = data.currentPoll;

      // Record response
      responses[message.name] = message.answer;

      // Update score if correct
      if (currentPoll && message.answer === currentPoll.correct) {
        scores[message.name] = (scores[message.name] || 0) + 10;
      } else if (!scores[message.name]) {
        scores[message.name] = 0;
      }

      chrome.storage.session.set({ responses, scores }, () => {
        // Broadcast leaderboard update to all Meet tabs
        const leaderboard = Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([name, score]) => ({ name, score }));

        chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              type: 'LEADERBOARD_UPDATE',
              leaderboard,
              totalParticipants: Object.keys(responses).length,
            }).catch(() => {});
          });
        });

        // Also notify popup
        chrome.runtime.sendMessage({
          type: 'RESPONSE_UPDATE',
          responses,
          scores,
        }).catch(() => {});
      });
    });
    sendResponse({ success: true });
  }

  if (message.type === 'END_SESSION') {
    // Clear all session data
    chrome.storage.session.clear(() => {
      chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { type: 'SESSION_ENDED' }).catch(() => {});
        });
      });
    });
    sendResponse({ success: true });
  }

  if (message.type === 'START_SESSION') {
    // Initialize session
    chrome.storage.session.set({
      sessionActive: true,
      currentPoll: null,
      responses: {},
      scores: {},
    }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }

  return true; // Keep message channel open for async responses
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('PW Meet Engage extension installed');
});
