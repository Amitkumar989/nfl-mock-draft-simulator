import { TEAMS } from '../data/teams';
import { getPositionClass } from '../utils';

export default function TeamPanel({ draftPicks, userTeamIndex, currentPickIndex, isDraftComplete }) {
  // Group picks by team
  const teamPicks = {};
  TEAMS.forEach(t => { teamPicks[t.name] = []; });
  draftPicks.forEach(pick => {
    if (teamPicks[pick.teamName]) {
      teamPicks[pick.teamName].push(pick);
    }
  });

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-draft-border">
        <h2 className="font-display font-bold text-lg text-draft-text flex items-center gap-2">
          <span className="text-draft-gold">🏆</span> Teams
        </h2>
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {TEAMS.map((team, index) => {
          const isUser = index === userTeamIndex;
          const isCurrent = !isDraftComplete && index === currentPickIndex;
          const picks = teamPicks[team.name];

          return (
            <div
              key={team.abbr}
              id={`team-panel-${team.abbr}`}
              className={`
                rounded-lg border p-3 transition-all duration-300
                ${isUser
                  ? 'border-draft-gold/50 bg-draft-gold/5'
                  : 'border-draft-border bg-draft-card/50'
                }
                ${isCurrent && !isDraftComplete
                  ? 'animate-pulse-gold'
                  : ''
                }
              `}
            >
              {/* Team header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className={`font-display font-bold text-sm ${
                    isUser ? 'text-draft-gold' : 'text-draft-text'
                  }`}>
                    {team.abbr}
                  </span>
                  {isUser && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-draft-gold/20 text-draft-gold font-semibold uppercase tracking-wider">
                      You
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">
                      On Clock
                    </span>
                  )}
                </div>
              </div>

              {/* Needs */}
              <div className="flex flex-wrap gap-1 mb-2">
                {team.needs.map(need => {
                  // Check if need was addressed
                  const addressed = picks.some(p => {
                    const pos = p.position.toUpperCase();
                    const n = need.toUpperCase();
                    if (n === 'OL') return pos.includes('OT') || pos.includes('OG') || pos.includes('OL');
                    return pos.includes(n);
                  });

                  return (
                    <span
                      key={need}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                        addressed
                          ? 'bg-emerald-500/20 text-emerald-400 line-through'
                          : 'bg-draft-border text-draft-muted'
                      }`}
                    >
                      {need}
                    </span>
                  );
                })}
              </div>

              {/* Drafted players */}
              {picks.length > 0 && (
                <div className="space-y-1">
                  {picks.map((pick, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-draft-dimmed w-5 shrink-0">R{pick.round}</span>
                      <span className="text-draft-text font-medium truncate flex-1">
                        {pick.playerName}
                      </span>
                      <span className={`position-badge text-[9px] shrink-0 ${getPositionClass(pick.position)}`}>
                        {pick.position}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty slots */}
              {picks.length < 4 && (
                <div className="space-y-1">
                  {Array.from({ length: 4 - picks.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-2 text-xs">
                      <span className="text-draft-dimmed w-5 shrink-0">R{picks.length + i + 1}</span>
                      <span className="text-draft-dimmed/50 italic">—</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
