import { useState } from 'react';
import TeamSelection from './components/TeamSelection';
import DraftBoard from './components/DraftBoard';
import Results from './components/Results';
import { PLAYERS } from './data/players';
import { TEAMS } from './data/teams';

export default function App() {
  const [phase, setPhase] = useState('team-selection'); // team-selection, drafting, results
  const [userTeamIndex, setUserTeamIndex] = useState(null);
  const [draftPicks, setDraftPicks] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState(PLAYERS);

  const handleSelectTeam = (index) => {
    setUserTeamIndex(index);
  };

  const handleStartDraft = () => {
    setPhase('drafting');
  };

  const handleDraftPlayer = (player, teamIndex, isAutoPick = false) => {
    const playerName = player.playerName || player.name;
    // ensure we get position and college from availablePlayers if missing
    const playerRecord = availablePlayers.find(p => p.name === playerName) || player;

    const newPick = {
      playerName,
      position: playerRecord.position,
      college: playerRecord.college,
      teamName: TEAMS[teamIndex].name,
      round: Math.floor(draftPicks.length / 7) + 1,
      pick: (draftPicks.length % 7) + 1,
      autoPicked: isAutoPick || player.autoPickFallback,
      reasoning: player.reasoning
    };

    setDraftPicks(prev => [...prev, newPick]);
    setAvailablePlayers(prev => prev.filter(p => p.name !== playerName));

    // If this was the last pick (28th), show results after a short delay
    if (draftPicks.length + 1 >= 28) {
      setTimeout(() => {
        setPhase('results');
      }, 500);
    }
  };

  const handleRestart = () => {
    setPhase('team-selection');
    setUserTeamIndex(null);
    setDraftPicks([]);
    setAvailablePlayers(PLAYERS);
  };

  return (
    <div className="w-full min-h-screen">
      {phase === 'team-selection' && (
        <TeamSelection 
          onSelectTeam={handleSelectTeam}
          onStartDraft={handleStartDraft}
          selectedTeam={userTeamIndex}
        />
      )}
      
      {phase === 'drafting' && (
        <DraftBoard 
          userTeamIndex={userTeamIndex}
          draftPicks={draftPicks}
          availablePlayers={availablePlayers}
          onDraftPlayer={handleDraftPlayer}
          phase={phase}
        />
      )}

      {phase === 'results' && (
        <Results 
          draftPicks={draftPicks}
          availablePlayers={availablePlayers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
