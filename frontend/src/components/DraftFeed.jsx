import { useEffect, useRef } from 'react';
import { getPositionClass } from '../utils';

export default function DraftFeed({ draftPicks, thinkingTeam }) {
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [draftPicks, thinkingTeam]);

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-draft-border">
        <h2 className="font-display font-bold text-lg text-draft-text flex items-center gap-2">
          <span className="text-draft-gold">📡</span> Live Draft Feed
        </h2>
        <p className="text-xs text-draft-muted mt-1">
          {draftPicks.length} of 28 picks made
        </p>
        {/* Progress bar */}
        <div className="mt-2 h-1 bg-draft-border rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all duration-500"
            style={{ width: `${(draftPicks.length / 28) * 100}%` }}
          />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {draftPicks.length === 0 && !thinkingTeam && (
          <div className="flex items-center justify-center h-full text-draft-dimmed text-sm">
            Draft picks will appear here...
          </div>
        )}

        {draftPicks.map((pick, i) => (
          <div
            key={i}
            className="animate-slide-in pick-card"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-start gap-3">
              {/* Round/Pick label */}
              <div className="shrink-0 w-16 text-center">
                <div className="text-[10px] uppercase tracking-wider text-draft-muted font-semibold">
                  Rd {pick.round}
                </div>
                <div className="text-lg font-display font-black text-draft-gold">
                  #{pick.pick}
                </div>
              </div>

              {/* Pick details */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-draft-muted font-medium mb-0.5">
                  {pick.teamName}
                </div>
                <div className="font-bold text-draft-text truncate">
                  {pick.playerName}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`position-badge text-[10px] ${getPositionClass(pick.position)}`}>
                    {pick.position}
                  </span>
                  <span className="text-xs text-draft-dimmed">{pick.college}</span>
                </div>
                {pick.autoPicked && (
                  <div className="mt-1 text-[10px] text-amber-400/80 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    AI auto-picked
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {thinkingTeam && (
          <div className="pick-card shimmer-bg animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-draft-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-draft-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-draft-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              <div className="text-sm text-draft-muted">
                <span className="font-semibold text-draft-gold">{thinkingTeam}</span> is on the clock...
              </div>
            </div>
          </div>
        )}

        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
