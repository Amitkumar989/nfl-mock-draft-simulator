import { useState, useEffect } from 'react';
import PlayerList from './PlayerList';
import DraftFeed from './DraftFeed';
import TeamPanel from './TeamPanel';
import { TEAMS } from '../data/teams';

export default function DraftBoard({ 
  userTeamIndex, 
  draftPicks, 
  availablePlayers, 
  onDraftPlayer,
  phase
}) {
  const [thinkingTeam, setThinkingTeam] = useState(null);
  
  const currentPickTotal = draftPicks.length;
  const currentTeamIndex = currentPickTotal % 7;
  const currentRound = Math.floor(currentPickTotal / 7) + 1;
  const isUserTurn = currentTeamIndex === userTeamIndex;
  const isDraftComplete = currentPickTotal >= 28;
  const currentTeam = TEAMS[currentTeamIndex];

  useEffect(() => {
    if (phase !== 'drafting' || isUserTurn || isDraftComplete) return;
    
    let isMounted = true;
    
    const doAIPick = async () => {
      setThinkingTeam(currentTeam.name);
      
      // 600ms thinking delay for a more natural draft feel
      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;
      
      try {
        const res = await fetch('/api/ai-pick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team: currentTeam,
            availablePlayers,
            draftedSoFar: draftPicks,
            round: currentRound
          })
        });
        const data = await res.json();
        
        if (isMounted) {
          setThinkingTeam(null);
          onDraftPlayer(data, currentTeamIndex, data.autoPickFallback);
        }
      } catch (err) {
        console.error("AI pick failed:", err);
        if (isMounted) {
           setThinkingTeam(null);
           // emergency fallback if backend fails completely
           if (availablePlayers.length > 0) {
              onDraftPlayer(availablePlayers[0], currentTeamIndex, true);
           }
        }
      }
    };
    
    doAIPick();
    
    return () => { isMounted = false; };
  }, [currentPickTotal, isUserTurn, phase, availablePlayers, draftPicks, currentRound, currentTeam, currentTeamIndex, onDraftPlayer, isDraftComplete]);
  
  const handleUserDraft = (player) => {
    if (isUserTurn && !isDraftComplete) {
      onDraftPlayer(player, userTeamIndex, false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col p-4 gap-4 overflow-hidden bg-draft-bg">
      {/* Top Bar showing current pick info */}
      <div className="glass-card p-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-xl font-display font-black gold-text">MOCK DRAFT SIMULATOR</h1>
            <p className="text-sm text-draft-muted mt-1">
               Drafting as: <span className="font-bold text-draft-text">{TEAMS[userTeamIndex].name}</span>
            </p>
         </div>
         <div className="text-center">
            {isDraftComplete ? (
              <div className="text-xl font-bold text-draft-gold">Draft Complete</div>
            ) : (
              <>
                 <div className="text-xs uppercase tracking-wider text-draft-muted font-bold">
                    Round {currentRound} • Pick {(currentPickTotal % 7) + 1}
                 </div>
                 <div className={`text-lg font-bold mt-1 ${isUserTurn ? 'text-draft-gold animate-pulse-gold inline-block px-4 py-1 rounded-full bg-draft-gold/10' : 'text-draft-text'}`}>
                    {currentTeam.name} {isUserTurn ? 'is ON THE CLOCK' : 'is picking...'}
                 </div>
              </>
            )}
         </div>
      </div>

      {/* Main 3 Panels */}
      <div className="flex-1 min-h-0 flex gap-4">
         <div className="w-1/3 min-h-0">
            <PlayerList 
               draftedNames={draftPicks.map(p => p.playerName)}
               isUserTurn={isUserTurn && !thinkingTeam && !isDraftComplete}
               userTeamNeeds={TEAMS[userTeamIndex].needs}
               onDraftPlayer={handleUserDraft}
            />
         </div>
         <div className="w-1/3 min-h-0">
            <DraftFeed 
               draftPicks={draftPicks}
               thinkingTeam={thinkingTeam}
            />
         </div>
         <div className="w-1/3 min-h-0">
            <TeamPanel 
               draftPicks={draftPicks}
               userTeamIndex={userTeamIndex}
               currentPickIndex={currentTeamIndex}
               isDraftComplete={isDraftComplete}
            />
         </div>
      </div>
    </div>
  );
}
