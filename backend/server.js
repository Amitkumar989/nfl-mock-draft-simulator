const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NFL Mock Draft Backend is running (Powered by Groq)' });
});

// POST /api/ai-pick
app.post('/api/ai-pick', async (req, res) => {
  try {
    const { team, availablePlayers, draftedSoFar, round } = req.body;

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const availableList = availablePlayers
      .map(p => `${p.rank}. ${p.name} - ${p.position} - ${p.college}`)
      .join('\n');

    const prompt = `You are an NFL GM for ${team.name}. Needs: ${team.needs.join(', ')}. Available players by rank: 
${availableList}. 
Round ${round} of 4. Pick the best player balancing talent rank and positional need. Respond ONLY with valid JSON in this exact format: { "playerName": "exact name", "reasoning": "one sentence" }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log('AI pick raw response:', text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error('JSON parse error. Raw text:', text);
      throw new Error('Invalid JSON from Groq');
    }

    // Validate that the picked player is actually available
    const pickedPlayer = availablePlayers.find(p =>
      p.name.toLowerCase().trim() === parsed.playerName.toLowerCase().trim()
    );

    if (!pickedPlayer) {
      console.error('Groq picked unavailable player:', parsed.playerName);
      throw new Error('Groq picked unavailable player');
    }

    res.json({
      ...pickedPlayer,
      reasoning: parsed.reasoning || 'Best available player for team needs.',
      autoPickFallback: false
    });

  } catch (error) {
    console.error('AI pick error:', error.message);

    // Fallback: pick highest-ranked available player matching a team need
    const { team, availablePlayers } = req.body;

    let fallbackPlayer = availablePlayers.find(p =>
      team.needs.some(need => p.position.toUpperCase().includes(need.toUpperCase()))
    );

    if (!fallbackPlayer && availablePlayers.length > 0) {
      fallbackPlayer = availablePlayers[0];
    }

    if (!fallbackPlayer) {
      return res.status(500).json({ error: 'No available players' });
    }

    res.json({
      ...fallbackPlayer,
      reasoning: 'Auto-picked as highest-ranked available player matching team needs.',
      autoPickFallback: true
    });
  }
});

// POST /api/draft-grade
app.post('/api/draft-grade', async (req, res) => {
  try {
    const teams = req.body;
    
    console.log("Draft grade called with", teams.length, "teams");
    console.log("API Key exists:", !!process.env.GROQ_API_KEY);
    
    const teamsText = teams.map(t => 
      `${t.teamName}: Needs [${t.needs.join(', ')}], Drafted: ${t.picks.map(p => `${p.name}(${p.position})`).join(', ')}`
    ).join('\n');

    const prompt = `You are an NFL draft analyst. Grade each team A through F based on how well their picks addressed their needs. Be varied in grades — not all teams should get the same grade.

${teamsText}

Reply with ONLY this JSON array, nothing else, no markdown:
{ "grades": [{"teamName":"Las Vegas Raiders","grade":"A","reasoning":"one sentence"},{"teamName":"New York Jets","grade":"B","reasoning":"one sentence"}] }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log("Groq raw response:", text);
    
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsed = JSON.parse(clean);
    
    // Support if Groq returns it nested inside { grades: [] } or just the array directly
    if (parsed.grades && Array.isArray(parsed.grades)) {
      parsed = parsed.grades;
    }
    
    res.json(parsed);
    
  } catch (error) {
    console.error('Draft grade error:', error.message);
    res.json(req.body.map(t => ({
      teamName: t.teamName || t.name,
      grade: 'B',
      reasoning: 'Solid draft class with picks that addressed key roster needs.'
    })));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`NFL Mock Draft Backend running on port ${PORT}`);
});
