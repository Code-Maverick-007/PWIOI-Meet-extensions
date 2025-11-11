import React, { useState } from 'react';

export default function PollViewer({ poll, onSubmit, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!participantName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    onSubmit(participantName.trim(), selectedOption);
    setSubmitted(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] animate-fade-in">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 max-w-md text-white text-center animate-slide-up shadow-2xl">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Answer Submitted!</h2>
          <p className="text-green-100">Check the leaderboard for your ranking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] animate-fade-in">
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 max-w-lg w-full mx-4 text-white shadow-2xl border border-blue-500/30 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl font-bold">New Poll</h2>
              <p className="text-sm text-gray-300">Select your answer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {poll.question}
          </h3>

          <div className="space-y-2 mb-4">
            {poll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedOption === index
                    ? 'bg-blue-600 border-2 border-blue-400 shadow-lg scale-105'
                    : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-white bg-white'
                        : 'border-gray-400'
                    }`}
                  >
                    {selectedOption === index && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-gray-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
