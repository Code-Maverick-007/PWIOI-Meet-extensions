import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

function PopupApp() {
  const [sessionActive, setSessionActive] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [responses, setResponses] = useState({});
  const [scores, setScores] = useState({});
  const [isMeetTab, setIsMeetTab] = useState(false);

  useEffect(() => {
    // Check if current tab is Google Meet
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url && currentTab.url.includes('meet.google.com')) {
        setIsMeetTab(true);
      }
    });

    // Load session state
    chrome.storage.session.get(['sessionActive', 'responses', 'scores'], (data) => {
      setSessionActive(data.sessionActive || false);
      setResponses(data.responses || {});
      setScores(data.scores || {});
    });

    // Listen for response updates
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'RESPONSE_UPDATE') {
        setResponses(message.responses);
        setScores(message.scores);
      }
    });
  }, []);

  const startSession = async () => {
    await chrome.runtime.sendMessage({ type: 'START_SESSION' });
    setSessionActive(true);
  };

  const endSession = async () => {
    await chrome.runtime.sendMessage({ type: 'END_SESSION' });
    setSessionActive(false);
    setResponses({});
    setScores({});
    setShowPollForm(false);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (correctAnswer >= options.length - 1) {
        setCorrectAnswer(0);
      }
    }
  };

  const sendPoll = async () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const poll = {
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correct: correctAnswer,
    };

    // Save to storage
    await chrome.storage.session.set({ currentPoll: poll });

    // Broadcast to all Meet tabs
    await chrome.runtime.sendMessage({
      type: 'NEW_POLL',
      poll,
    });

    alert('Poll sent to all participants!');
    setShowPollForm(false);
    setQuestion('');
    setOptions(['', '']);
    setCorrectAnswer(0);
  };

  const leaderboard = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (!isMeetTab) {
    return (
      <div className="w-96 p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Not a Google Meet Tab</h2>
          <p className="text-gray-300 text-sm">
            Please open a Google Meet session to use PW Meet Engage
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 min-h-[500px] bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">PW Meet Engage</h1>
          <p className="text-sm text-gray-300">Host Control Panel</p>
        </div>

        {/* Session Control */}
        {!sessionActive ? (
          <button
            onClick={startSession}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors mb-4"
          >
            🚀 Start New Session
          </button>
        ) : (
          <div className="space-y-3 mb-6">
            <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 text-center">
              <span className="text-green-300 font-semibold">✓ Session Active</span>
            </div>
            
            {!showPollForm ? (
              <div className="space-y-2">
                <button
                  onClick={() => setShowPollForm(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  📊 Create New Poll
                </button>
                <button
                  onClick={endSession}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  End Session
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-lg">Create Poll/Quiz</h3>
                
                <input
                  type="text"
                  placeholder="Enter your question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
                />

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Options:</label>
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="correct"
                        checked={correctAnswer === index}
                        onChange={() => setCorrectAnswer(index)}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none text-sm"
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {options.length < 4 && (
                  <button
                    onClick={addOption}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Option
                  </button>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={sendPoll}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition-colors"
                  >
                    Send Poll
                  </button>
                  <button
                    onClick={() => setShowPollForm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Responses & Leaderboard */}
        {sessionActive && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-2">📊 Live Responses</h3>
              <div className="text-2xl font-bold text-center text-blue-400">
                {Object.keys(responses).length}
              </div>
              <div className="text-center text-sm text-gray-300">participants responded</div>
            </div>

            {leaderboard.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-600/30">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  🏆 Top 3 Leaderboard
                </h3>
                <div className="space-y-2">
                  {leaderboard.map(([name, score], index) => (
                    <div
                      key={name}
                      className="flex items-center justify-between bg-gray-800/50 rounded p-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <span className="font-semibold">{name}</span>
                      </div>
                      <span className="font-bold text-yellow-400">{score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<PopupApp />);
