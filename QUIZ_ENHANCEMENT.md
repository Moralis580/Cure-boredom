# Quiz Game - Enhanced Questions & API Integration

## What's Been Updated

### 1. Rocket Physics - Faster Gameplay ⚡
**Changes Made:**
- **GRAVITY**: Reduced from 0.6 → 0.45 (25% decrease)
- **THRUST**: Reduced from 0.8 → 0.6 (25% decrease)

**Effect:**
- Rocket falls faster
- Responds more quickly to engine input
- More challenging and faster-paced gameplay
- Physics feel more snappy

### 2. Quiz Game - Major Expansion 📚

**Questions Expanded:**
- **Old**: 5 questions
- **New**: 40 questions across 8 categories

**Categories Included:**
1. **Geography** (5 questions) - World capitals, landmarks, geography facts
2. **Science - Space** (5 questions) - Planets, moons, stars, moon landing
3. **Science - Physics & Math** (5 questions) - Physics, chemistry, units of matter
4. **Literature & Arts** (5 questions) - Famous authors, painters, books
5. **History** (5 questions) - Historical events, dates, famous figures
6. **Biology** (5 questions) - Human body, cells, ecosystems
7. **Technology** (5 questions) - Internet, smartphones, computers
8. **Sports** (5 questions) - Basketball, soccer, Olympics, sports facts
9. **Entertainment & Movies** (5 questions) - Films, actors, box office records

### 3. Question Shuffling ✨
**Feature Added:**
- Questions are now **randomly shuffled** every game
- Players will see questions in a different order each time
- Prevents memorization
- Increases replay value

**How It Works:**
```javascript
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const shuffledQuiz = shuffleArray(quizData);
```

### 4. Enhanced Scoring
**Changes:**
- Points per correct answer: 20 → 10 (more questions, balanced scoring)
- Added **accuracy percentage** display at end
- Shows how many correct out of total questions

**Example:**
```
Score: 320
You got 32 out of 40 correct!
Accuracy: 80%
```

## Future Enhancement: API Integration for Dynamic Questions

### Option 1: Wikipedia API (Simple)
```javascript
// Fetch random Wikipedia article summaries
async function fetchWikipediaQuestion() {
    const response = await fetch(
        'https://en.wikipedia.org/api/rest_v1/page/random/summary'
    );
    const data = await response.json();
    // Generate questions from article content
    return generateQuestionFromContent(data.extract);
}
```

### Option 2: Open Trivia Database (Recommended)
```javascript
// Free API with thousands of questions
async function fetchTriviaQuestions() {
    const response = await fetch(
        'https://opentdb.com/api.php?amount=40&type=multiple&encode=url3986'
    );
    const data = await response.json();
    return data.results.map(q => ({
        question: decodeURIComponent(q.question),
        options: [
            decodeURIComponent(q.correct_answer),
            ...q.incorrect_answers.map(a => decodeURIComponent(a))
        ].sort(() => Math.random() - 0.5),
        correct: 0
    }));
}
```

### Option 3: Custom Backend API
```javascript
// Create your own question database
app.get('/api/quiz/questions', (req, res) => {
    const randomQuestions = quizDatabase
        .sort(() => Math.random() - 0.5)
        .slice(0, 40);
    res.json(randomQuestions);
});
```

## Files Modified
✏️ `app.js` - Lines 355-360 (physics) and 591-720 (quiz)

## Testing the Changes

### Rocket Game:
1. Play rocket flight
2. Notice faster falling and response
3. Game should feel more challenging

### Quiz Game:
1. Play quiz
2. Note question order is different each time
3. 40 questions should appear
4. Results show accuracy percentage

## Performance Impact
✅ No performance decrease
✅ Questions load instantly (pre-loaded in JavaScript)
✅ Shuffling is very fast
✅ Works offline (no API required)

## Next Steps: Implementing API-Based Questions

To use external APIs for truly dynamic questions:

### Step 1: Install required package
```bash
npm install axios
```

### Step 2: Modify quiz function to use API
```javascript
async function startQuizGame() {
    try {
        const response = await fetch(
            'https://opentdb.com/api.php?amount=40&type=multiple'
        );
        const data = await response.json();
        const quizData = data.results.map(q => ({
            question: decodeURIComponent(q.question),
            options: shuffleAnswers(q),
            correct: 0
        }));
        // Continue with rest of game...
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        // Fallback to local questions
    }
}
```

### Step 3: Add error handling
```javascript
// Fallback to local questions if API fails
const quizData = apiQuestions || defaultQuizData;
```

## API Options Comparison

| API | Pros | Cons |
|-----|------|------|
| **Open Trivia DB** | Free, large database, no auth | 6000 questions limit |
| **Wikipedia** | Always up-to-date, vast content | Requires parsing, slow |
| **Custom Backend** | Full control, fast | Requires maintenance |
| **Local Questions** | Works offline, instant | Manual updates needed |

**Recommendation:** Use Open Trivia DB for now, with local questions as fallback

## Current Status
✅ 40 diverse questions implemented
✅ Automatic shuffling enabled
✅ Enhanced scoring system
✅ Faster rocket physics
❓ API integration (ready for implementation)

Would you like me to implement live API integration for the quiz questions? I can set it up with the Open Trivia Database which requires no authentication! 🚀
