// Player Data Management
let playerData = {
    name: localStorage.getItem('playerName') || 'Guest Player',
    score: parseInt(localStorage.getItem('playerScore') || '0'),
    gamesPlayed: parseInt(localStorage.getItem('playerGamesPlayed') || '0'),
    wins: parseInt(localStorage.getItem('playerWins') || '0')
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    updateProfile();
    document.getElementById('playerNameInput').value = playerData.name;
});

// Navigation
function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Save Player Name
function saveName() {
    const newName = document.getElementById('playerNameInput').value.trim();
    if (newName) {
        playerData.name = newName;
        localStorage.setItem('playerName', newName);
        updateProfile();
    }
}

// Update Profile Display
function updateProfile() {
    document.getElementById('playerName').textContent = playerData.name;
    document.getElementById('totalScore').textContent = playerData.score;
    document.getElementById('gamesPlayed').textContent = playerData.gamesPlayed;
    const winRate = playerData.gamesPlayed > 0 ? 
        Math.round((playerData.wins / playerData.gamesPlayed) * 100) : 0;
    document.getElementById('winRate').textContent = winRate + '%';
    document.getElementById('playerLevel').textContent = `Level ${Math.floor(playerData.score / 100) + 1}`;
}

// Save Score
function saveScore(points) {
    playerData.score += points;
    playerData.gamesPlayed++;
    playerData.wins++;
    
    localStorage.setItem('playerScore', playerData.score);
    localStorage.setItem('playerGamesPlayed', playerData.gamesPlayed);
    localStorage.setItem('playerWins', playerData.wins);
    
    updateProfile();
    loadLeaderboard();
}

// Leaderboard Management
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    
    // Add current player if not exists
    const existingIndex = leaderboard.findIndex(p => p.name === playerData.name);
    if (existingIndex >= 0) {
        leaderboard[existingIndex] = {
            name: playerData.name,
            score: playerData.score,
            gamesPlayed: playerData.gamesPlayed
        };
    } else if (playerData.score > 0) {
        leaderboard.push({
            name: playerData.name,
            score: playerData.score,
            gamesPlayed: playerData.gamesPlayed
        });
    }
    
    // Sort by score
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    // Display leaderboard
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboard.slice(0, 10).forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="rank-${index < 3 ? index + 1 : ''}">${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${player.gamesPlayed}</td>
        `;
        tbody.appendChild(row);
    });
}

// Game Modal Management
function openGame() {
    document.getElementById('gameModal').style.display = 'block';
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    document.getElementById('gameContainer').innerHTML = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ==================== MEMORY GAME ====================
function startMemoryGame() {
    openGame();
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <h2>🧠 Memory Match</h2>
        <div class="game-info">
            <div class="info-item">
                <div class="info-label">Moves</div>
                <div class="info-value" id="memoryMoves">0</div>
            </div>
            <div class="info-item">
                <div class="info-label">Score</div>
                <div class="info-value" id="memoryScore">0</div>
            </div>
        </div>
        <div id="memoryGrid" class="memory-grid"></div>
        <div style="text-align: center; margin-top: 2rem;">
            <button class="btn btn-primary" onclick="initMemoryGame()">Start New Game</button>
        </div>
    `;
    initMemoryGame();
}

function initMemoryGame() {
    const emojis = ['🍎', '🍌', '🍕', '🍔', '🍪', '🎂', '🍇', '🍓'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    let flipped = [];
    let matched = 0;
    let moves = 0;
    let score = 0;
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '?';
        card.onclick = () => flipCard(card, emoji, index);
        grid.appendChild(card);
    });
    
    function flipCard(card, emoji, index) {
        if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length >= 2) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = emoji;
        flipped.push({ card, emoji, index });
        
        if (flipped.length === 2) {
            moves++;
            document.getElementById('memoryMoves').textContent = moves;
            
            if (flipped[0].emoji === flipped[1].emoji) {
                flipped[0].card.classList.add('matched');
                flipped[1].card.classList.add('matched');
                score += 10;
                matched++;
                document.getElementById('memoryScore').textContent = score;
                flipped = [];
                
                if (matched === emojis.length) {
                    setTimeout(() => {
                        alert(`🎉 You Won! Score: ${score}`);
                        saveScore(score);
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    flipped[0].card.classList.remove('flipped');
                    flipped[1].card.classList.remove('flipped');
                    flipped[0].card.textContent = '?';
                    flipped[1].card.textContent = '?';
                    flipped = [];
                }, 800);
            }
        }
    }
}

// ==================== SNAKE GAME ====================
function startSnakeGame() {
    openGame();
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <h2>🐍 Snake Game</h2>
        <div class="game-info">
            <div class="info-item">
                <div class="info-label">Score</div>
                <div class="info-value" id="snakeScore">0</div>
            </div>
            <div class="info-item">
                <div class="info-label">High Score</div>
                <div class="info-value" id="snakeHighScore">0</div>
            </div>
        </div>
        <canvas id="snakeCanvas" width="600" height="400"></canvas>
        <div style="text-align: center; margin-top: 1rem;">
            <p>Use WASD Keys to control the snake</p>
            <button class="btn btn-primary" onclick="startSnakeGame()">Play Again</button>
        </div>
    `;
    
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let score = 0;
    let gameRunning = true;
    
    const gridSize = 20;
    
    // Keyboard controls (WASD)
    document.addEventListener('keydown', (e) => {
        if (gameRunning) {
            const key = e.key.toLowerCase();
            switch(key) {
                case 'w':
                    if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                    break;
                case 's':
                    if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                    break;
                case 'a':
                    if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                    break;
                case 'd':
                    if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                    break;
            }
        }
    });
    
    function update() {
        direction = nextDirection;
        
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        
        // Check collision with walls
        if (head.x < 0 || head.x >= canvas.width / gridSize || 
            head.y < 0 || head.y >= canvas.height / gridSize) {
            endSnakeGame();
            return;
        }
        
        // Check collision with self
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endSnakeGame();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snakeScore').textContent = score;
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
        } else {
            snake.pop();
        }
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#6c5ce7';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, 
                         gridSize - 2, gridSize - 2);
        });
        
        // Draw food
        ctx.fillStyle = '#ff7675';
        ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, 
                     gridSize - 2, gridSize - 2);
    }
    
    function endSnakeGame() {
        gameRunning = false;
        const highScore = Math.max(score, parseInt(localStorage.getItem('snakeHighScore') || '0'));
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('snakeHighScore').textContent = highScore;
        alert(`Game Over! Final Score: ${score}`);
        saveScore(score);
    }
    
    function gameLoop() {
        update();
        draw();
        if (gameRunning) {
            setTimeout(gameLoop, 100);
        }
    }
    
    // Load high score
    const highScore = localStorage.getItem('snakeHighScore') || '0';
    document.getElementById('snakeHighScore').textContent = highScore;
    
    gameLoop();
}

// ==================== ROCKET GAME ====================
function startRocketGame() {
    openGame();
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <h2>🚀 Rocket Flight</h2>
        <div class="game-info">
            <div class="info-item">
                <div class="info-label">Altitude</div>
                <div class="info-value" id="rocketAltitude">0m</div>
            </div>
            <div class="info-item">
                <div class="info-label">Velocity</div>
                <div class="info-value" id="rocketVelocity">0</div>
            </div>
            <div class="info-item">
                <div class="info-label">Best</div>
                <div class="info-value" id="rocketBest">0m</div>
            </div>
        </div>
        <canvas id="rocketCanvas" width="600" height="400"></canvas>
        <div style="text-align: center; margin-top: 1rem;">
            <p>Hold SPACEBAR to fire engines and climb! Release to fall.</p>
            <button class="btn btn-primary" onclick="startRocketGame()">Play Again</button>
        </div>
    `;
    
    const canvas = document.getElementById('rocketCanvas');
    const ctx = canvas.getContext('2d');
    
    // Rocket physics constants (reduced by 0.25 for faster gameplay)
    const GRAVITY = 0.45;          // Downward acceleration (was 0.6)
    const THRUST = 0.6;            // Upward acceleration when engine fires (was 0.8)
    const MAX_VELOCITY = 15;       // Terminal velocity
    const FRICTION = 0.98;         // Air resistance
    
    let rocket = { 
        x: 50, 
        y: canvas.height / 2, 
        width: 20, 
        height: 20, 
        velocity: 0,
        maxAltitude: 0,
        fuel: 100,
        maxFuel: 100
    };
    
    let obstacles = [];
    let altitude = 0;
    let gameRunning = true;
    let spawnRate = 0;
    let engineActive = false;
    
    // Controls
    document.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.code === 'Space') && gameRunning) {
            engineActive = true;
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            engineActive = false;
        }
    });
    
    document.addEventListener('mousedown', () => {
        if (gameRunning) engineActive = true;
    });
    
    document.addEventListener('mouseup', () => {
        engineActive = false;
    });
    
    function update() {
        // Apply gravity constantly
        rocket.velocity += GRAVITY;
        
        // Apply thrust if engine is active and fuel available
        if (engineActive && gameRunning && rocket.fuel > 0) {
            rocket.velocity -= THRUST;  // Negative = upward
            rocket.fuel -= 1.5;
            if (rocket.fuel < 0) rocket.fuel = 0;
        } else {
            // Passive fuel recovery when not firing
            rocket.fuel += 0.2;
            if (rocket.fuel > rocket.maxFuel) rocket.fuel = rocket.maxFuel;
        }
        
        // Apply air resistance (friction)
        rocket.velocity *= FRICTION;
        
        // Clamp velocity to prevent extreme speeds
        if (rocket.velocity > MAX_VELOCITY) rocket.velocity = MAX_VELOCITY;
        if (rocket.velocity < -MAX_VELOCITY) rocket.velocity = -MAX_VELOCITY;
        
        // Update position
        rocket.y += rocket.velocity;
        
        // Calculate altitude (height above starting position)
        altitude = Math.max(0, (canvas.height / 2 - rocket.y) * 0.5);
        rocket.maxAltitude = Math.max(rocket.maxAltitude, altitude);
        
        // Update display
        document.getElementById('rocketAltitude').textContent = Math.floor(altitude) + 'm';
        document.getElementById('rocketVelocity').textContent = Math.floor(rocket.velocity * 10) / 10;
        
        // Check boundaries (crash at top or bottom)
        if (rocket.y < 0 || rocket.y + rocket.height > canvas.height) {
            endRocketGame();
            return;
        }
        
        // Spawn obstacles
        spawnRate++;
        if (spawnRate > 80) {
            const gap = 90;
            const gapPosition = Math.random() * (canvas.height - gap - 60) + 30;
            
            obstacles.push({
                x: canvas.width,
                topHeight: gapPosition,
                bottomY: gapPosition + gap,
                width: 40
            });
            spawnRate = 0;
        }
        
        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= 4;
            
            // Check collision
            if (checkCollision(rocket, obstacles[i])) {
                endRocketGame();
                return;
            }
            
            // Remove off-screen obstacles
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
    }
    
    function checkCollision(rocket, obstacle) {
        if (rocket.x + rocket.width > obstacle.x &&
            rocket.x < obstacle.x + obstacle.width) {
            if (rocket.y < obstacle.topHeight ||
                rocket.y + rocket.height > obstacle.bottomY) {
                return true;
            }
        }
        return false;
    }
    
    function draw() {
        // Draw gradient sky background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(0.5, '#2a5298');
        gradient.addColorStop(1, '#87ceeb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw altitude indicator lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw rocket
        ctx.save();
        ctx.translate(rocket.x + rocket.width / 2, rocket.y + rocket.height / 2);
        
        // Rocket body
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(-rocket.width / 2, -rocket.height / 2, rocket.width, rocket.height);
        
        // Rocket nose
        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.moveTo(-rocket.width / 2, -rocket.height / 2);
        ctx.lineTo(0, -rocket.height / 2 - 8);
        ctx.lineTo(rocket.width / 2, -rocket.height / 2);
        ctx.fill();
        
        // Rocket window
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.arc(0, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Engine flames (only when firing)
        if (engineActive && rocket.fuel > 0) {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(-rocket.width / 2 + 2, rocket.height / 2, rocket.width - 4, 8);
            
            ctx.fillStyle = '#ffd93d';
            const flameHeight = Math.random() * 8 + 6;
            ctx.fillRect(-rocket.width / 2 + 4, rocket.height / 2 + 8, rocket.width - 8, flameHeight);
            
            ctx.fillStyle = '#ff8c00';
            ctx.fillRect(-rocket.width / 2 + 6, rocket.height / 2 + 8, rocket.width - 12, flameHeight * 0.6);
        }
        
        ctx.restore();
        
        // Draw fuel bar
        const fuelBarWidth = 100;
        const fuelBarHeight = 8;
        ctx.fillStyle = '#333';
        ctx.fillRect(canvas.width - fuelBarWidth - 10, 10, fuelBarWidth, fuelBarHeight);
        ctx.fillStyle = rocket.fuel > 30 ? '#00b894' : rocket.fuel > 15 ? '#fdcb6e' : '#ff7675';
        ctx.fillRect(canvas.width - fuelBarWidth - 10, 10, (rocket.fuel / rocket.maxFuel) * fuelBarWidth, fuelBarHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width - fuelBarWidth - 10, 10, fuelBarWidth, fuelBarHeight);
        
        // Draw fuel label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('Fuel', canvas.width - fuelBarWidth - 10, 7);
        
        // Draw obstacles
        ctx.fillStyle = '#2d3436';
        obstacles.forEach(obs => {
            // Top obstacle
            ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
            // Bottom obstacle
            ctx.fillRect(obs.x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
        });
    }
    
    function endRocketGame() {
        gameRunning = false;
        const bestAltitude = Math.max(rocket.maxAltitude, parseInt(localStorage.getItem('rocketBest') || '0'));
        localStorage.setItem('rocketBest', bestAltitude);
        document.getElementById('rocketBest').textContent = Math.floor(bestAltitude) + 'm';
        alert(`Game Over!\nMax Altitude: ${Math.floor(rocket.maxAltitude)}m\nFinal Velocity: ${Math.floor(rocket.velocity * 10) / 10}m/s`);
        saveScore(Math.floor(rocket.maxAltitude));
    }
    
    function gameLoop() {
        update();
        draw();
        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    // Load best score
    const bestScore = localStorage.getItem('rocketBest') || '0';
    document.getElementById('rocketBest').textContent = bestScore;
    
    gameLoop();
}

// ==================== QUIZ GAME ====================
function startQuizGame() {
    openGame();
    
    const quizData = [
        // Geography
        {
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Madrid"],
            correct: 1
        },
        {
            question: "Which country is home to the Great Barrier Reef?",
            options: ["New Zealand", "Australia", "Fiji", "Papua New Guinea"],
            correct: 1
        },
        {
            question: "What is the largest desert in the world?",
            options: ["Sahara", "Antarctic", "Arabian", "Gobi"],
            correct: 1
        },
        {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
            correct: 1
        },
        {
            question: "What is the capital of Japan?",
            options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
            correct: 1
        },
        
        // Science - Space
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: 1
        },
        {
            question: "What is the closest star to Earth besides the Sun?",
            options: ["Sirius", "Proxima Centauri", "Alpha Centauri", "Betelgeuse"],
            correct: 1
        },
        {
            question: "How many moons does Jupiter have?",
            options: ["16", "67", "95", "79"],
            correct: 3
        },
        {
            question: "What is the diameter of the Sun compared to Earth?",
            options: ["10x", "100x", "109x", "1000x"],
            correct: 2
        },
        {
            question: "In what year did the Apollo 11 moon landing occur?",
            options: ["1965", "1967", "1969", "1971"],
            correct: 2
        },
        
        // Science - Physics & Math
        {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correct: 1
        },
        {
            question: "What is the speed of light?",
            options: ["300,000 m/s", "150,000 km/s", "300,000 km/s", "1,000,000 km/s"],
            correct: 2
        },
        {
            question: "Who discovered gravity?",
            options: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Galileo Galilei"],
            correct: 1
        },
        {
            question: "What is the chemical symbol for Gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        },
        {
            question: "What is the smallest unit of matter?",
            options: ["Atom", "Molecule", "Quark", "Electron"],
            correct: 2
        },
        
        // Literature & Arts
        {
            question: "Who wrote Romeo and Juliet?",
            options: ["Mark Twain", "Jane Austen", "William Shakespeare", "Charles Dickens"],
            correct: 2
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
            correct: 1
        },
        {
            question: "Who wrote 'To Kill a Mockingbird'?",
            options: ["Harper Lee", "Mark Twain", "F. Scott Fitzgerald", "Ernest Hemingway"],
            correct: 0
        },
        {
            question: "In which year was 'Harry Potter and the Philosopher's Stone' published?",
            options: ["1995", "1997", "1998", "2000"],
            correct: 1
        },
        {
            question: "Who wrote 'Pride and Prejudice'?",
            options: ["Charlotte Brontë", "Emily Brontë", "Jane Austen", "George Eliot"],
            correct: 2
        },
        
        // History
        {
            question: "In which year did the Titanic sink?",
            options: ["1912", "1915", "1920", "1905"],
            correct: 0
        },
        {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
            correct: 1
        },
        {
            question: "In what year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correct: 2
        },
        {
            question: "Who was the first Emperor of Rome?",
            options: ["Julius Caesar", "Augustus", "Nero", "Caligula"],
            correct: 1
        },
        {
            question: "In which year did the Berlin Wall fall?",
            options: ["1987", "1988", "1989", "1990"],
            correct: 2
        },
        
        // Biology
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3
        },
        {
            question: "How many bones does an adult human have?",
            options: ["186", "206", "226", "246"],
            correct: 1
        },
        {
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
            correct: 1
        },
        {
            question: "What gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correct: 2
        },
        {
            question: "How many chambers does a human heart have?",
            options: ["2", "3", "4", "5"],
            correct: 2
        },
        
        // Technology
        {
            question: "Who is credited with inventing the internet?",
            options: ["Bill Gates", "Tim Berners-Lee", "Vint Cerf", "Jon Postel"],
            correct: 1
        },
        {
            question: "In what year was the first iPhone released?",
            options: ["2005", "2006", "2007", "2008"],
            correct: 2
        },
        {
            question: "What does 'CPU' stand for?",
            options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor Unit"],
            correct: 1
        },
        {
            question: "Who founded Microsoft?",
            options: ["Steve Jobs", "Bill Gates", "Steve Ballmer", "Paul Allen"],
            correct: 1
        },
        {
            question: "What does 'AI' stand for?",
            options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Interface", "Applied Interaction"],
            correct: 1
        },
        
        // Sports
        {
            question: "How many players are on a basketball team on the court?",
            options: ["4", "5", "6", "7"],
            correct: 1
        },
        {
            question: "How many World Cups has Brazil won?",
            options: ["3", "4", "5", "6"],
            correct: 2
        },
        {
            question: "What is the maximum break in snooker?",
            options: ["147", "180", "187", "200"],
            correct: 0
        },
        {
            question: "How long is an Olympic swimming pool?",
            options: ["25m", "40m", "50m", "75m"],
            correct: 2
        },
        {
            question: "In which sport is the Stanley Cup awarded?",
            options: ["Basketball", "Ice Hockey", "Football", "Baseball"],
            correct: 1
        },
        
        // Entertainment & Movies
        {
            question: "How many main 'Star Wars' saga films have been released as of 2023?",
            options: ["7", "8", "9", "10"],
            correct: 2
        },
        {
            question: "Who directed 'Inception'?",
            options: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Denis Villeneuve"],
            correct: 1
        },
        {
            question: "What year was the first 'Avengers' movie released?",
            options: ["2010", "2011", "2012", "2013"],
            correct: 2
        },
        {
            question: "Who plays Iron Man in the MCU?",
            options: ["Chris Evans", "Robert Downey Jr.", "Mark Ruffalo", "Chris Hemsworth"],
            correct: 1
        },
        {
            question: "What is the highest-grossing film of all time (as of 2023)?",
            options: ["Avatar", "Avatar: The Way of Water", "Avengers: Endgame", "Titanic"],
            correct: 1
        }
    ];
    
    // Shuffle function
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Select 10 random questions from 40 and shuffle them
    const allQuestionsShuffled = shuffleArray(quizData);
    const shuffledQuiz = allQuestionsShuffled.slice(0, 10);  // Take first 10 from shuffled array
    
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    
    const gameContainer = document.getElementById('gameContainer');
    
    function showQuestion() {
        answered = false;
        const question = shuffledQuiz[currentQuestion];
        
        gameContainer.innerHTML = `
            <h2>❓ Quiz Master</h2>
            <div class="quiz-container">
                <div class="quiz-score">Question ${currentQuestion + 1} of ${shuffledQuiz.length}</div>
                <div class="quiz-question">${question.question}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('quizOptions');
        question.options.forEach((option, index) => {
            const button = document.createElement('div');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => selectAnswer(index, question.correct);
            optionsContainer.appendChild(button);
        });
    }
    
    function selectAnswer(selected, correct) {
        if (answered) return;
        answered = true;
        
        const options = document.querySelectorAll('.quiz-option');
        options[selected].classList.add('selected');
        options[correct].classList.add('correct');
        
        if (selected === correct) {
            score += 10;
            options[selected].classList.remove('selected');
            options[selected].classList.add('correct');
        } else {
            options[selected].classList.remove('selected');
            options[selected].classList.add('incorrect');
        }
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < shuffledQuiz.length) {
                showQuestion();
            } else {
                endQuiz();
            }
        }, 1500);
    }
    
    function endQuiz() {
        const correctAnswers = Math.floor(score / 10);
        gameContainer.innerHTML = `
            <h2>🎉 Quiz Complete!</h2>
            <div class="quiz-container" style="text-align: center;">
                <div style="font-size: 3rem; margin: 2rem 0; color: #6c5ce7;">
                    ${score}
                </div>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                    You got ${correctAnswers} out of ${shuffledQuiz.length} correct!
                </p>
                <p style="font-size: 1rem; color: #636e72; margin-bottom: 2rem;">
                    Accuracy: ${Math.round((correctAnswers / shuffledQuiz.length) * 100)}%
                </p>
                <button class="btn btn-primary" onclick="startQuizGame()">Play Again</button>
            </div>
        `;
        saveScore(score);
    }
    
    showQuestion();
}
