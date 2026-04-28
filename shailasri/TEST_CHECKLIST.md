# 🎮 Quick Test Checklist - Rocket Physics

## Pre-Game Setup

### Browser Requirements
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)
- [ ] JavaScript enabled
- [ ] LocalStorage enabled

### File Verification
- [ ] `index.html` exists
- [ ] `app.js` exists and has physics code
- [ ] `styles.css` exists
- [ ] Can open index.html in browser

## Gameplay Tests

### Start Game
- [ ] Click "Rocket Flight" button
- [ ] Game modal opens
- [ ] Canvas displays properly
- [ ] Shows: Altitude, Velocity, Best Score

### Spacebar Controls
- [ ] Hold SPACEBAR - rocket climbs smoothly
- [ ] Release SPACEBAR - rocket falls smoothly
- [ ] Climbing is slow (0.2 net acceleration)
- [ ] Falling is steady (0.6 acceleration)

### Fuel System
- [ ] Fuel bar visible (top-right)
- [ ] Fuel depletes while firing (-1.5/frame)
- [ ] Fuel recharges when not firing (+0.2/frame)
- [ ] Bar turns green (>30%) → yellow (>15%) → red (<15%)
- [ ] Can't fire if fuel is empty

### Velocity Display
- [ ] Shows current velocity (m/s)
- [ ] Positive = falling, Negative = climbing
- [ ] Updates in real-time
- [ ] Max velocity capped at ~15

### Altitude Display
- [ ] Shows current altitude in meters
- [ ] Increases as you climb
- [ ] Decreases as you fall
- [ ] Resets on crash

### Obstacle Spawning
- [ ] Obstacles appear from right side
- [ ] Move left at constant speed
- [ ] Create random gaps
- [ ] Gaps are consistently sized (~90px)
- [ ] Gaps vary in position

### Collision Detection
- [ ] Hitting top obstacle ends game
- [ ] Hitting bottom obstacle ends game
- [ ] Hitting side doesn't crash (only left wall matters)
- [ ] Gap allows safe passage

### Game End
- [ ] Shows "Game Over!" alert
- [ ] Displays max altitude reached
- [ ] Displays final velocity
- [ ] Shows "Play Again" button
- [ ] Can restart by clicking button

## Physics Tests

### Gravity Test
**Setup:** Don't press any keys
**Expected:** Rocket falls steadily
**Check:**
- [ ] Falls immediately (no delay)
- [ ] Acceleration constant
- [ ] Speed increases each frame
- [ ] Hits bottom in ~8-10 seconds

### Thrust Test
**Setup:** Hold SPACEBAR continuously
**Expected:** Rocket climbs slowly but continuously
**Check:**
- [ ] Climbs upward
- [ ] Speed increases slightly, then stabilizes
- [ ] Never climbs faster than ~15 units/frame
- [ ] Fuel depletes visibly

### Friction Test
**Setup:** Hold SPACEBAR, then release suddenly
**Expected:** Velocity dampens smoothly
**Check:**
- [ ] Doesn't stop instantly
- [ ] Gradual deceleration
- [ ] Smooth transition to falling

### Fuel Management Test
**Setup:** Alternate firing and coasting
**Expected:** Strategic fuel usage possible
**Check:**
- [ ] Can reach high altitudes by pulsing
- [ ] Completely depleting fuel is possible
- [ ] Fuel recharges during coasting
- [ ] Optimal strategy emerges

## Visual Tests

### Rocket Design
- [ ] Rocket has red body
- [ ] Rocket has yellow nose cone
- [ ] Rocket has window (light blue)
- [ ] Rocket is centered on X-axis

### Engine Flames
- [ ] No flames when not firing
- [ ] Yellow flames appear when firing
- [ ] Orange inner flames visible
- [ ] Flames animate/flicker slightly
- [ ] Flames disappear when fuel empty

### Background
- [ ] Dark blue at top
- [ ] Light blue at bottom
- [ ] Gradient smooth
- [ ] Grid lines visible (altitude reference)

### UI Elements
- [ ] Title displays properly
- [ ] Score displays properly
- [ ] Velocity displays properly
- [ ] Fuel bar displays properly
- [ ] All text readable

## Performance Tests

### Frame Rate
- [ ] Game runs smoothly (60 FPS target)
- [ ] No stuttering when firing
- [ ] No lag when obstacles spawn
- [ ] Smooth obstacle movement

### Memory
- [ ] Game doesn't leak memory
- [ ] Can play multiple rounds
- [ ] No console errors
- [ ] Browser doesn't crash

## Scoring Tests

### Altitude Calculation
- [ ] Score = max altitude reached
- [ ] High score saved in localStorage
- [ ] Leaderboard updates
- [ ] Different runs have different scores

### Leaderboard
- [ ] Appears on page
- [ ] Shows your scores
- [ ] Shows top 10 players
- [ ] Sorted by highest score

## Edge Cases

### Extreme Cases
- [ ] Rocket at y=0 (top) - should crash
- [ ] Rocket at y=400 (bottom) - should crash
- [ ] Out of fuel high up - falls to death
- [ ] Very tight gaps - requires precision

### Restart
- [ ] Game can be restarted multiple times
- [ ] Scores accumulate
- [ ] No cross-game interference
- [ ] Fresh state each restart

## Optional Advanced Tests

### Physics Tuning
- [ ] Can edit GRAVITY constant
- [ ] Game behavior changes appropriately
- [ ] THRUST adjustments work
- [ ] MAX_VELOCITY limits apply

### Mobile/Touch
- [ ] Mouse click works as engine fire
- [ ] Touch works (if tested on mobile)
- [ ] Controls responsive

## Final Checklist

- [ ] All physics tests pass
- [ ] All visual tests pass
- [ ] Gameplay feels responsive
- [ ] No console errors (F12)
- [ ] Can play for extended time
- [ ] Scores save correctly
- [ ] Ready for release! 🚀

---

## Troubleshooting If Tests Fail

**Problem:** Rocket doesn't move
- [ ] Check if event listeners firing (console.log)
- [ ] Verify `engineActive` variable
- [ ] Check physics constants are numbers

**Problem:** Rocket jumps instead of accelerates
- [ ] Verify `velocity -= THRUST` is being used
- [ ] Check THRUST value isn't too high
- [ ] Ensure gravity is being applied

**Problem:** Fuel bar not showing
- [ ] Check fuel bar CSS exists
- [ ] Verify canvas width calculation
- [ ] Check context (ctx) is valid

**Problem:** Obstacles not spawning
- [ ] Check spawnRate logic (should reset after ~80 frames)
- [ ] Verify canvas.width is correct
- [ ] Check random gap calculation

**Problem:** Game won't restart
- [ ] Check closeGame() is called
- [ ] Verify eventListeners removed
- [ ] Check modal closing properly

---

## Demo High Score Targets

- 🥉 **Bronze:** 500m altitude
- 🥈 **Silver:** 1000m altitude  
- 🥇 **Gold:** 2000m altitude
- 🏆 **Legend:** 5000m+ altitude

Good luck! 🚀
