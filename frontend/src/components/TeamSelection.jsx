import { useState } from 'react';
import { TEAMS } from '../data/teams';

const TEAM_LOGOS = {
  LV: '🏴‍☠️',
  NYJ: '✈️',
  ARI: '🐦',
  TEN: '⚔️',
  NYG: '🗽',
  CLE: '🐕',
  WSH: '🏛️',
};

export default function TeamSelection({ onSelectTeam, onStartDraft, selectedTeam }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-draft-gold/50" />
          <span className="text-draft-gold text-sm font-semibold tracking-[0.3em] uppercase">
            2026 NFL
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-draft-gold/50" />
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-3">
          <span className="gold-text text-shadow-gold">MOCK DRAFT</span>
        </h1>
        <p className="text-lg text-draft-muted max-w-lg mx-auto">
          Select your team and compete against AI-powered GMs in a 4-round draft simulation
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl w-full mb-10">
        {TEAMS.map((team, index) => {
          const isSelected = selectedTeam === index;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={team.abbr}
              id={`team-card-${team.abbr}`}
              onClick={() => onSelectTeam(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative group glass-card p-5 text-left transition-all duration-300 cursor-pointer
                ${isSelected
                  ? 'border-draft-gold bg-draft-gold/10 animate-glow ring-1 ring-draft-gold/30'
                  : 'hover:border-draft-borderLight hover:bg-draft-cardHover'
                }
              `}
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Pick number badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #d4af37, #f0d060)'
                    : team.color,
                  color: isSelected ? '#0a0e1a' : '#fff',
                }}
              >
                #{team.pick}
              </div>

              {/* Team icon */}
              <div className="text-3xl mb-2">{TEAM_LOGOS[team.abbr]}</div>

              {/* Team name */}
              <h3 className={`font-display font-bold text-lg mb-1 transition-colors ${
                isSelected ? 'text-draft-gold' : 'text-draft-text'
              }`}>
                {team.name}
              </h3>

              {/* Needs */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {team.needs.map(need => (
                  <span
                    key={need}
                    className={`position-badge position-${need.toLowerCase()}`}
                  >
                    {need}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 gold-gradient rounded-b-xl" />
              )}
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <div className={`transition-all duration-500 ${
        selectedTeam !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          id="start-draft-btn"
          onClick={onStartDraft}
          disabled={selectedTeam === null}
          className="group relative px-10 py-4 rounded-xl font-display font-bold text-lg text-draft-bg
            gold-gradient shadow-lg shadow-draft-gold/20
            hover:shadow-xl hover:shadow-draft-gold/30 hover:scale-105
            active:scale-95 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2">
            🏈 Start Draft
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
        {selectedTeam !== null && (
          <p className="text-center text-draft-muted text-sm mt-3">
            Drafting as the <span className="text-draft-gold font-semibold">{TEAMS[selectedTeam].name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
