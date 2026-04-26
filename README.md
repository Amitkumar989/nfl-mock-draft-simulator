# NFL Mock Draft Simulator 🏈

A 4-round NFL Mock Draft Simulator where you act as the General Manager for one team, while a powerful AI (powered by Groq / Llama-3) controls the remaining 6 teams in your division/group, making realistic picks based on positional needs and player rankings.

## Features ✨
- **Interactive Draft Board:** Live, real-time draft feed with beautiful, dynamic UI.
- **AI Opponents:** Fast, context-aware AI drafting using the Groq API (Llama-3.3-70b-versatile). The AI evaluates team needs and best-available talent.
- **Positional Needs & Rankings:** Players are categorized and ranked to reflect real-world draft value.
- **AI Draft Grader:** After the draft finishes, the AI acts as an NFL Draft Analyst, evaluating all picks and assigning an A-F grade with a one-sentence reasoning for every team.
- **Premium UI:** Smooth animations, glassmorphism design, and an engaging "on the clock" experience.

## Tech Stack 🛠️
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI Integration:** Groq SDK (Llama 3 Models)

---

## Setup Instructions 🚀

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd assignment
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file and add your Groq API Key
echo "GROQ_API_KEY=your_key_here" > .env
echo "PORT=3001" >> .env

# Start the server
node server.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to start drafting!

---

Loom Walkthrough: [Watch the Demo](https://www.loom.com/share/3fae2aed9f6945bbbf0d822e174b3dff)
