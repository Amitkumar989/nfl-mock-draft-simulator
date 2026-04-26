import { getPositionClass, positionMatchesNeed } from '../utils';
import { PLAYERS } from '../data/players';

export default function PlayerList({ draftedNames, isUserTurn, userTeamNeeds, onDraftPlayer }) {
  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-draft-border">
        <h2 className="font-display font-bold text-lg text-draft-text flex items-center gap-2">
          <span className="text-draft-gold">📋</span> Big Board
        </h2>
        <p className="text-xs text-draft-muted mt-1">
          {PLAYERS.length - draftedNames.length} players available
        </p>
      </div>

      {/* Player List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {PLAYERS.map(player => {
          const isDrafted = draftedNames.includes(player.name);
          const matchesNeed = isUserTurn && !isDrafted && positionMatchesNeed(player.position, userTeamNeeds);
          const canDraft = isUserTurn && !isDrafted;

          return (
            <button
              key={player.rank}
              id={`player-${player.rank}`}
              disabled={!canDraft}
              onClick={() => canDraft && onDraftPlayer(player)}
              className={`
                w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isDrafted
                  ? 'opacity-30 cursor-not-allowed'
                  : canDraft
                    ? matchesNeed
                      ? 'bg-draft-gold/10 border border-draft-gold/30 hover:bg-draft-gold/20 cursor-pointer'
                      : 'hover:bg-draft-cardHover cursor-pointer'
                    : 'opacity-60 cursor-default'
                }
              `}
            >
              {/* Rank */}
              <span className={`w-7 text-center text-sm font-bold shrink-0 ${
                isDrafted ? 'text-draft-dimmed line-through' : 'text-draft-muted'
              }`}>
                {player.rank}
              </span>

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm truncate ${
                  isDrafted ? 'line-through text-draft-dimmed' : 'text-draft-text'
                }`}>
                  {player.name}
                </div>
                <div className={`text-xs ${isDrafted ? 'text-draft-dimmed' : 'text-draft-muted'}`}>
                  {player.college}
                </div>
              </div>

              {/* Position badge */}
              <span className={`position-badge shrink-0 ${
                isDrafted ? 'opacity-40' : ''
              } ${getPositionClass(player.position)}`}>
                {player.position}
              </span>

              {/* Need match indicator */}
              {matchesNeed && !isDrafted && (
                <span className="text-draft-gold text-xs shrink-0" title="Matches team need">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
