// Storage utility functions using chrome.storage.session

export const getSessionData = () => {
  return new Promise((resolve) => {
    chrome.storage.session.get(
      ['sessionActive', 'currentPoll', 'responses', 'scores'],
      (data) => {
        resolve({
          sessionActive: data.sessionActive || false,
          currentPoll: data.currentPoll || null,
          responses: data.responses || {},
          scores: data.scores || {},
        });
      }
    );
  });
};

export const setSessionData = (data) => {
  return new Promise((resolve) => {
    chrome.storage.session.set(data, () => {
      resolve();
    });
  });
};

export const clearSessionData = () => {
  return new Promise((resolve) => {
    chrome.storage.session.clear(() => {
      resolve();
    });
  });
};

export const getCurrentPoll = () => {
  return new Promise((resolve) => {
    chrome.storage.session.get(['currentPoll'], (data) => {
      resolve(data.currentPoll || null);
    });
  });
};

export const getLeaderboard = () => {
  return new Promise((resolve) => {
    chrome.storage.session.get(['scores', 'responses'], (data) => {
      const scores = data.scores || {};
      const responses = data.responses || {};
      
      const leaderboard = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, score]) => ({ name, score }));

      resolve({
        leaderboard,
        totalParticipants: Object.keys(responses).length,
      });
    });
  });
};
