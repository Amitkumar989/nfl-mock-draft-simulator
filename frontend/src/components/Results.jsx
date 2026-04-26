import { useState, useEffect } from 'react';
import { TEAMS } from '../data/teams';
import { getPositionClass } from '../utils';

export default function Results({ draftPicks, availablePlayers, onRestart }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group picks
  const teamsData = TEAMS.map(t => {
    return {
      teamName: t.name,
      needs: t.needs,
      picks: draftPicks.filter(p => p.teamName === t.name).map(p => ({
        name: p.playerName,
        position: p.position
      }))
    };
  });

  useEffect(() => {
    let isMounted = true;
    const fetchGrades = async () => {
      try {
        // Wait a tiny bit before fetching grades
        await new Promise(r => setTimeout(r, 100));
        
        const res = await fetch('/api/draft-grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teamsData)
        });
        const data = await res.json();
        if (isMounted) {
          setGrades(data);
        }
      } catch (err) {
        console.error("Draft grade fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchGrades();
    return () => { isMounted = false; };
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-draft-bg p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black gold-text mb-2 text-shadow-gold">DRAFT RESULTS</h1>
          <p className="text-draft-muted">Final 4-Round Mock Draft Simulator Grades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEAMS.map((team) => {
            const teamPicks = teamsData.find(t => t.teamName === team.name).picks;
            const teamGrade = grades.find(g => g.teamName === team.name);

            return (
              <div key={team.abbr} className="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:border-draft-borderLight hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.color }} />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-draft-text">{team.name}</h3>
                    <div className="text-xs text-draft-muted mt-1 flex gap-1">
                      Needs: {team.needs.map(n => <span key={n} className={`position-badge text-[9px] ${getPositionClass(n)}`}>{n}</span>)}
                    </div>
                  </div>
                  {/* Grade Circle */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-draft-surface border-2 border-draft-border flex items-center justify-center font-display font-black text-2xl gold-text shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    {loading ? (
                      <span className="text-sm animate-pulse text-draft-muted">...</span>
                    ) : (
                      teamGrade?.grade || 'N/A'
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {teamPicks.map((pick, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-draft-borderLight pb-1.5 last:border-0 last:pb-0">
                      <span className="font-medium text-draft-text">{pick.name}</span>
                      <span className={`position-badge text-[10px] ${getPositionClass(pick.position)}`}>{pick.position}</span>
                    </div>
                  ))}
                </div>
                
                {/* Reasoning */}
                <div className="bg-draft-surface/50 rounded p-3 text-xs text-draft-dimmed italic border border-draft-border/50">
                  {loading ? 'Evaluating draft class...' : teamGrade?.reasoning || 'No analysis available.'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-6 mt-8 border-draft-gold/20">
          <h3 className="font-display font-bold text-draft-text mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-draft-gold">⭐</span> Remaining Undrafted Players
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {availablePlayers.map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-draft-surface px-4 py-2 rounded-lg border border-draft-borderLight">
                <span className="font-medium text-sm text-draft-muted">{p.name}</span>
                <span className={`position-badge text-[10px] ${getPositionClass(p.position)}`}>{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={onRestart}
            className="group px-8 py-3 rounded-xl font-display font-bold text-draft-bg gold-gradient shadow-lg shadow-draft-gold/20 hover:scale-105 hover:shadow-draft-gold/40 active:scale-95 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Draft Again <span className="group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
