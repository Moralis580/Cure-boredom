# API Integration Guide - Dynamic Quiz Questions

## Current Status

Your quiz game now has:
- ✅ **40 pre-loaded questions** (no internet needed)
- ✅ **Automatic shuffling** (randomized order)
- ✅ **8 categories** of questions
- ✅ **Offline mode** (works without internet)

## Want to Add Dynamic Questions from the Internet?

Here are the best options with implementation examples.

---

## Option 1: Open Trivia Database (RECOMMENDED) ⭐

**Pros:**
- ✅ Free, no authentication required
- ✅ 5000+ questions available
- ✅ Multiple categories and difficulty levels
- ✅ Fast response times
- ✅ Always up-to-date content

**Cons:**
- ❌ Requires internet connection
- ❌ Occasionally slower responses

### Implementation:

Replace the quiz function with this:

```javascript
async function startQuizGame() {
    openGame();
    
    let quizData = [];
    
    try {
        // Fetch questions from Open Trivia Database
        const response = await fetch(
            'https://opentdb.com/api.php?amount=40&type=multiple&encode=url3986'
        );
        const data = await response.json();
        
        // Transform API response to our format
        quizData = data.results.map((q, index) => ({
            question: decodeURIComponent(q.question),
            options: [
                decodeURIComponent(q.correct_answer),
                ...q.incorrect_answers.map(a => decodeURIComponent(a))
            ].sort(() => Math.random() - 0.5),  // Shuffle options
            correct: 0  // Correct answer is always first (position 0)
        }));
        
        console.log('Loaded', quizData.length, 'questions from API');
    } catch (error) {
        console.log('API failed, using local questions:', error);
        quizData = getLocalQuizData();  // Fallback to local questions
    }
    
    // Rest of your quiz game code...
    // (same as before from line 651 onwards)
}
```

### Available Parameters:

```
?amount=10          // Number of questions (1-50)
?category=9         // Category ID (see list below)
?difficulty=easy    // easy, medium, hard
?type=multiple      // multiple choice
?encode=url3986     // URL-encode answers
```

### Category IDs:

```
9 = General Knowledge
10 = Books
11 = Film
12 = Music
13 = Musicals & Theatres
14 = Television
15 = Video Games
16 = Board Games
17 = Science & Nature
18 = Computers
19 = Mathematics
20 = Mythology
21 = Sports
22 = Geography
23 = History
24 = Politics
25 = Art
26 = Celebrities
27 = Animals
28 = Vehicles
29 = Comics
30 = Gadgets
31 = Anime & Manga
32 = Cartoons & Animation
```

### Example URLs:

```
// 40 random questions
https://opentdb.com/api.php?amount=40&type=multiple

// 20 science questions, medium difficulty
https://opentdb.com/api.php?amount=20&category=17&difficulty=medium&type=multiple

// 30 history questions, hard
https://opentdb.com/api.php?amount=30&category=23&difficulty=hard&type=multiple
```

---

## Option 2: Wikipedia API

**Pros:**
- ✅ Always up-to-date information
- ✅ Vast range of topics
- ✅ No rate limiting for casual use

**Cons:**
- ❌ Requires parsing article text
- ❌ Slower response times
- ❌ Difficult to generate questions automatically

### Implementation:

```javascript
async function fetchWikipediaQuestion() {
    try {
        const response = await fetch(
            'https://en.wikipedia.org/api/rest_v1/page/random/summary'
        );
        const data = await response.json();
        
        // Extract text and generate question
        const text = data.extract;
        const sentences = text.split('.');
        
        // Create a simple question from the text
        return {
            question: `This article is about: "${data.title}"?`,
            options: [data.title, 'Other Topic', 'Another Topic', 'Different Topic'],
            correct: 0
        };
    } catch (error) {
        console.error('Wikipedia API error:', error);
    }
}
```

---

## Option 3: Jeopardy API (Free)

**Pros:**
- ✅ Real Jeopardy questions
- ✅ Well-formatted data
- ✅ Interesting questions

**Cons:**
- ❌ Only ~200,000 questions
- ❌ Answers might be Jeopardy-style (backwards)

### Implementation:

```javascript
async function fetchJeopardyQuestion() {
    try {
        const response = await fetch(
            'https://jeopardy.p.rapidapi.com/random?count=40',
            {
                headers: {
                    'X-RapidAPI-Key': 'YOUR_API_KEY',
                    'X-RapidAPI-Host': 'jeopardy.p.rapidapi.com'
                }
            }
        );
        const data = await response.json();
        // Transform data...
    } catch (error) {
        console.error('Jeopardy API error:', error);
    }
}
```

---

## Option 4: Custom Backend API

**Pros:**
- ✅ Full control over questions
- ✅ Can add custom logic
- ✅ Fast responses
- ✅ Can track question difficulty

**Cons:**
- ❌ Requires backend maintenance
- ❌ Need to host questions

### Implementation (Backend):

```javascript
// In your server.js
app.get('/api/quiz/random', (req, res) => {
    const quizDatabase = require('./quiz-db.json');
    
    // Get random questions
    const randomQuestions = quizDatabase
        .sort(() => Math.random() - 0.5)
        .slice(0, 40);
    
    res.json({
        questions: randomQuestions,
        timestamp: new Date()
    });
});
```

### Implementation (Frontend):

```javascript
async function startQuizGame() {
    try {
        const response = await fetch('/api/quiz/random');
        const data = await response.json();
        const quizData = data.questions;
        
        // Continue with game...
    } catch (error) {
        console.error('Failed to fetch quiz:', error);
        // Use local fallback
    }
}
```

---

## Implementation Steps

### Step 1: Add Loading UI
```javascript
const gameContainer = document.getElementById('gameContainer');
gameContainer.innerHTML = `
    <h2>❓ Quiz Master</h2>
    <div style="text-align: center; margin: 2rem;">
        <p>Loading questions...</p>
        <div class="loading-spinner"></div>
    </div>
`;
```

### Step 2: Fetch Questions
```javascript
try {
    const response = await fetch('API_URL_HERE');
    const data = await response.json();
    quizData = transformData(data);
} catch (error) {
    quizData = localQuizData;  // Fallback
}
```

### Step 3: Add Timeout
```javascript
const fetchWithTimeout = (url, timeout = 5000) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
};
```

### Step 4: Error Handling
```javascript
try {
    // Try API
    quizData = await fetchQuestionsFromAPI();
} catch (error1) {
    console.warn('API failed, trying backup:', error1);
    try {
        // Try backup API
        quizData = await fetchQuestionsFromBackup();
    } catch (error2) {
        console.warn('Backup failed, using local:', error2);
        // Use local questions
        quizData = localQuizData;
    }
}
```

---

## Comparison Table

| Feature | Local | Open Trivia | Wikipedia | Jeopardy | Custom |
|---------|-------|------------|-----------|----------|--------|
| **No Internet** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Always Available** | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| **Setup Required** | ❌ | ❌ | ❌ | ⚠️ API Key | ✅ |
| **Question Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | ✅ Fast | ✅ Fast | ⚠️ Slow | ⚠️ Medium | ✅ Fast |
| **Question Variety** | 40 | 5000+ | Unlimited | 200k+ | Custom |

---

## Recommended: Hybrid Approach

Combine local + API for best results:

```javascript
async function startQuizGame() {
    openGame();
    
    let quizData = [];
    const useApi = navigator.onLine;  // Check internet
    
    if (useApi) {
        try {
            // Try to fetch from API
            const response = await fetch(
                'https://opentdb.com/api.php?amount=40&type=multiple&encode=url3986',
                { timeout: 5000 }
            );
            const data = await response.json();
            quizData = data.results.map(q => ({
                question: decodeURIComponent(q.question),
                options: [
                    decodeURIComponent(q.correct_answer),
                    ...q.incorrect_answers.map(a => decodeURIComponent(a))
                ].sort(() => Math.random() - 0.5),
                correct: 0
            }));
            console.log('Using API questions');
        } catch (error) {
            console.warn('API failed, using local:', error);
            quizData = getLocalQuizData();
        }
    } else {
        console.log('Offline mode, using local questions');
        quizData = getLocalQuizData();
    }
    
    // Continue with game...
}

function getLocalQuizData() {
    // Return your 40 questions from app.js
}
```

---

## Next Steps

1. **Test Current System**: Play quiz a few times, verify shuffling works
2. **Choose API**: Open Trivia DB recommended (easiest)
3. **Add Fallback Logic**: Keep local questions as backup
4. **Monitor Performance**: Check API response times
5. **Add User Feedback**: Show "API" or "Local" label during game

---

Would you like me to implement the Open Trivia Database API integration for you? 🚀

It's completely free, no API key needed, and takes about 20 lines of code!
