# Rocket Physics Engine - Technical Details

## Physics Equations

### Velocity Update (Each Frame)
```
v = v + gravity                    // Gravity pulls down
v = v - thrust (if engine active)  // Thrust pushes up
v = v * friction                   // Air resistance damping
v = clamp(v, -MAX_V, +MAX_V)      // Terminal velocity cap
```

### Position Update
```
y = y + v                          // Move rocket by velocity
altitude = max_height_reached      // Track maximum altitude
```

## Constants Explanation

| Constant | Value | Meaning |
|----------|-------|---------|
| `GRAVITY` | 0.6 | Downward acceleration per frame |
| `THRUST` | 0.8 | Upward acceleration when engine fires |
| `FRICTION` | 0.98 | Velocity multiplier (dampening) |
| `MAX_VELOCITY` | 15 | Maximum speed (up or down) |

## How Physics Work

### Without Engine:
1. Gravity accelerates rocket downward
2. Friction dampens velocity slightly
3. Rocket accelerates to terminal velocity then maintains it

### With Engine Firing:
1. Thrust accelerates rocket upward
2. Gravity still pulls down (opposing thrust)
3. Net acceleration = THRUST - GRAVITY = 0.8 - 0.6 = 0.2 upward
4. Fuel depletes while firing
5. When fuel runs out, gravity takes over

### Fuel System:
- Start with 100 fuel
- Firing engines: -1.5 fuel/frame
- Not firing: +0.2 fuel/frame (recharge)
- Max fuel: 100

## Game Mechanics

### Obstacles:
- Spawn every ~80 frames
- Travel left at 4 pixels/frame
- Create random gaps for rocket to pass through
- Collision ends game

### Scoring:
- Points = Maximum altitude reached
- Fuel management is key to survival

### Real-World Physics Simulation:
This is a simplified but realistic simulation of rocket physics:
- ✅ Gravity constant
- ✅ Thrust provides upward force
- ✅ Air resistance dampens velocity
- ✅ Fuel consumption for thrust
- ✅ Terminal velocity limit
- ❌ Not included: rotation, angle, wind, fuel mass changes

## Tweaking Physics

To adjust difficulty or feel, modify these values in `app.js`:

```javascript
// Make rocket more responsive
const THRUST = 1.0;  // Increase from 0.8

// Make gravity stronger
const GRAVITY = 0.8; // Increase from 0.6

// Less air resistance (faster rocket)
const FRICTION = 0.99; // Increase from 0.98

// Higher max speed
const MAX_VELOCITY = 20; // Increase from 15

// More fuel consumption
rocket.fuel -= 2.0;  // Increase from 1.5
```

## Comparison: Old vs New

### Old Physics (Broken):
- SPACEBAR sets velocity to fixed jump_power (-10)
- Gravity applies: velocity += 0.5
- Result: Rocket jumps to -10, then gradually falls
- Problem: Uncontrolled, felt exponential

### New Physics (Fixed):
- SPACEBAR applies acceleration: velocity -= 0.8
- Gravity applies: velocity += 0.6
- Friction applies: velocity *= 0.98
- Result: Smooth, responsive, realistic control
- Benefit: Players can fine-tune altitude by modulating thrust

Enjoy the improved gameplay! 🚀
