import React from 'react';

export default function Leaderboard({ leaderboard, totalParticipants }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-xl shadow-2xl p-4 min-w-[280px] border border-purple-500/30 animate-slide-up z-[10000]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span>Top 3</span>
        </h3>
        <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded-full">
          {totalParticipants} players
        </span>
      </div>

      <div className="space-y-2">
        {leaderboard.map((player, index) => (
          <div
            key={player.name}
            className="flex items-center justify-between bg-white/10 rounded-lg p-2 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <span className="font-semibold text-white text-sm truncate max-w-[140px]">
                {player.name}
              </span>
            </div>
            <span className="font-bold text-yellow-300 text-sm">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
