const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.dirname(__dirname))); // Serve static files

// Database file path
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
function initDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            players: [],
            scores: []
        }));
    }
}

// Read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { players: [], scores: [] };
    }
}

// Write database
function writeDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Get all players
app.get('/api/players', (req, res) => {
    const db = readDatabase();
    res.json(db.players);
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const db = readDatabase();
    const leaderboard = db.players
        .map(player => ({
            id: player.id,
            name: player.name,
            totalScore: player.totalScore,
            gamesPlayed: player.gamesPlayed,
            wins: player.wins,
            level: Math.floor(player.totalScore / 100) + 1
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 100);
    
    res.json(leaderboard);
});

// Get player by ID
app.get('/api/players/:id', (req, res) => {
    const db = readDatabase();
    const player = db.players.find(p => p.id === req.params.id);
    
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
});

// Create new player
app.post('/api/players', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const db = readDatabase();
    const newPlayer = {
        id: Date.now().toString(),
        name: name.trim(),
        totalScore: 0,
        gamesPlayed: 0,
        wins: 0,
        createdAt: new Date().toISOString()
    };
    
    db.players.push(newPlayer);
    writeDatabase(db);
    
    res.status(201).json(newPlayer);
});

// Update player score
app.post('/api/players/:id/score', (req, res) => {
    const { score, gameType } = req.body;
    
    if (typeof score !== 'number') {
        return res.status(400).json({ error: 'Score must be a number' });
    }
    
    const db = readDatabase();
    const player = db.players.find(p => p.id === req.params.id);
    
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    
    player.totalScore += score;
    player.gamesPlayed++;
    if (score > 0) player.wins++;
    
    // Record score
    const scoreRecord = {
        playerId: player.id,
        playerName: player.name,
        score: score,
        gameType: gameType || 'unknown',
        timestamp: new Date().toISOString()
    };
    
    db.scores.push(scoreRecord);
    writeDatabase(db);
    
    res.json(player);
});

// Get player stats
app.get('/api/players/:id/stats', (req, res) => {
    const db = readDatabase();
    const player = db.players.find(p => p.id === req.params.id);
    
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    
    const playerScores = db.scores.filter(s => s.playerId === req.params.id);
    
    const stats = {
        ...player,
        level: Math.floor(player.totalScore / 100) + 1,
        winRate: player.gamesPlayed > 0 ? 
            Math.round((player.wins / player.gamesPlayed) * 100) : 0,
        recentScores: playerScores.slice(-10),
        gameBreakdown: getGameBreakdown(playerScores)
    };
    
    res.json(stats);
});

// Get game scores
app.get('/api/scores/:gameType', (req, res) => {
    const db = readDatabase();
    const gameScores = db.scores
        .filter(s => s.gameType === req.params.gameType)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
    
    res.json(gameScores);
});

// Get high scores
app.get('/api/high-scores', (req, res) => {
    const db = readDatabase();
    
    const highScores = {
        overall: db.players
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10),
        recent: db.scores
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10)
    };
    
    res.json(highScores);
});

// Helper function to breakdown scores by game type
function getGameBreakdown(scores) {
    const breakdown = {};
    scores.forEach(score => {
        if (!breakdown[score.gameType]) {
            breakdown[score.gameType] = { count: 0, totalScore: 0 };
        }
        breakdown[score.gameType].count++;
        breakdown[score.gameType].totalScore += score.score;
    });
    return breakdown;
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Reset database (for testing only)
app.post('/api/reset', (req, res) => {
    initDatabase();
    res.json({ message: 'Database reset' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
initDatabase();
app.listen(PORT, () => {
    console.log(`GameHub Backend running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api`);
});
