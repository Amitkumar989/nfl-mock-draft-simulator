/**
 * Returns the CSS class for a position badge based on position string.
 */
export function getPositionClass(position) {
  const pos = position.toUpperCase();
  if (pos.includes('QB')) return 'position-qb';
  if (pos.includes('WR')) return 'position-wr';
  if (pos.includes('RB')) return 'position-rb';
  if (pos.includes('TE')) return 'position-te';
  if (pos.includes('OT') || pos.includes('OG') || pos.includes('OL')) return 'position-ol';
  if (pos.includes('EDGE')) return 'position-edge';
  if (pos.includes('DT')) return 'position-dt';
  if (pos.includes('CB')) return 'position-cb';
  if (pos.includes('S') && !pos.includes('SS')) return 'position-s';
  if (pos.includes('LB')) return 'position-lb';
  return 'bg-gray-500/20 text-gray-400';
}

/**
 * Check if a player's position matches a team need.
 */
export function positionMatchesNeed(position, needs) {
  const pos = position.toUpperCase();
  return needs.some(need => {
    const n = need.toUpperCase();
    if (n === 'OL') return pos.includes('OT') || pos.includes('OG') || pos.includes('OL');
    return pos.includes(n);
  });
}
