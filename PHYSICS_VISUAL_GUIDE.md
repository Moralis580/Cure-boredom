# Rocket Physics - Visual Guide

## Physics Engine Flow

```
┌─────────────────────────────────────────────┐
│   GAME LOOP (Every Frame)                   │
└─────────────┬───────────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │  UPDATE FUNCTION    │
    └────────┬────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────────┐  ┌──────────────┐
│  GRAVITY    │  │ ENGINE THRUST│
│ v += 0.6    │  │ v -= 0.8     │
│ (always)    │  │ (if firing)  │
└─────────────┘  └──────────────┘
    │                 │
    └────────┬────────┘
             │
             ▼
      ┌─────────────────┐
      │ AIR FRICTION    │
      │ v *= 0.98       │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ TERMINAL VEL    │
      │ clamp(v, ±15)   │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ POSITION UPDATE │
      │ y += v          │
      └────────┬────────┘
               │
               ▼
         ┌──────────┐
         │ CHECK    │
         │ COLLISIONS
         └──────────┘
```

## Velocity Changes Per Frame

### Engine OFF (Free Fall with Air Resistance):
```
Frame 1: v = 0
Frame 2: v = 0 + 0.6 = 0.6      (gravity)
Frame 3: v = 0.6 + 0.6 = 1.2    (gravity)
Frame 4: v = 1.2 + 0.6 = 1.8    (gravity)
...continues until terminal velocity reached...
Frame N: v ≈ 15                 (MAX_VELOCITY limit)
```

### Engine ON (Fighting Gravity):
```
Frame 1: v = 0
Frame 2: v = (0 + 0.6 - 0.8) * 0.98 = -0.196  (going up!)
Frame 3: v = (-0.196 + 0.6 - 0.8) * 0.98 = -0.235
Frame 4: v = (-0.235 + 0.6 - 0.8) * 0.98 = -0.268
...continues...
```

## Net Forces

```
Engine OFF:
  ↓ GRAVITY (0.6)
  ─────────────
  ↓ NET = 0.6 (downward)

Engine ON:
  ↑ THRUST (0.8)
  ↓ GRAVITY (0.6)
  ─────────────
  ↑ NET = 0.2 (upward!)

With Friction (both cases):
  Result velocity multiplied by 0.98
  (slightly slower each frame)
```

## Altitude vs Time Graph

```
WITHOUT ENGINE (Falling):
Altitude
   │     ___
   │    /   \  <- Peak goes down over time
   │   /     \
   │  /       \
   │ /         \___
   │/_______________
   └──────────────── Time

WITH STEADY ENGINE (Climbing):
Altitude
   │            ___
   │           /
   │          /
   │         /   <- Steady climb
   │        /
   │       /
   │______/_______
   └──────────────── Time

WITH PULSED ENGINE (Optimal):
Altitude
   │      /\    /\
   │     /  \  /  \  <- Controlled oscillation
   │    /    \/    \
   │___/____________
   └──────────────── Time
```

## Fuel System

```
┌────────────────────────────────┐
│ FUEL MANAGEMENT                │
└────────────────────────────────┘

When Engine Firing:
  fuel -= 1.5 per frame
  [████████░░░] 80%

When Engine OFF:
  fuel += 0.2 per frame  (slow recharge)
  [████████░░░] 80%

Out of Fuel:
  Can't fire!
  Must wait for recharge
  [████░░░░░░░] 40%

Fully Charged:
  [██████████] 100%
  Ready to go!
```

## Collision Detection

```
Canvas (600x400):
  ╔═════════════════════════════════════╗
  ║                                     ║
  ║    ┌──────┐        ┌──────┐        ║
  ║    │ Top  │        │ Top  │        ║
  ║    │ Obs  │   Gap  │ Obs  │        ║
  ║    └──────┘  <90px>└──────┘        ║
  ║             ┌────┐                  ║
  ║             │Rkt │                  ║
  ║             └────┘                  ║
  ║    ┌──────┐        ┌──────┐        ║
  ║    │Bottom│        │Bottom│        ║
  ║    │ Obs  │        │ Obs  │        ║
  ║    └──────┘        └──────┘        ║
  ║                                     ║
  ╚═════════════════════════════════════╝

Collision Logic:
if (rocket.x overlaps obstacle.x) {
  if (rocket.y < gap_top OR rocket.y > gap_bottom) {
    CRASH! 💥
  }
}
```

## Advanced: Tuning Guide

### Easy Mode
```javascript
const GRAVITY = 0.4      // Less pull
const THRUST = 1.0       // More push
const FRICTION = 0.99    // Less drag
const MAX_VELOCITY = 20  // Higher limit
```

### Hard Mode
```javascript
const GRAVITY = 0.8      // More pull
const THRUST = 0.6       // Less push
const FRICTION = 0.95    // More drag
const MAX_VELOCITY = 12  // Lower limit
```

### Arcade Mode (Fast)
```javascript
const GRAVITY = 0.8
const THRUST = 1.2
const FRICTION = 0.99
const MAX_VELOCITY = 25
```

## Common Physics Mistakes (Avoided!)

❌ **Old Code Problem:**
```javascript
if (spacebar) {
  velocity = -10;  // JUMP to exact velocity - bad!
}
```
This caused instant, uncontrolled jumps.

✅ **New Code Solution:**
```javascript
if (spacebar) {
  velocity -= THRUST;  // ACCELERATE - good!
}
```
This applies gradual acceleration that can be modulated.

---

**Summary:** The rocket physics now properly simulate:
- Constant gravitational acceleration
- Controlled thrust application
- Air resistance dampening
- Terminal velocity limits
- Fuel resource management

This creates a challenging but fair game where player skill matters! 🚀
