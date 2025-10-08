# Snakes and Ladders Game Setup

## Quick Start

### 1. Start the Backend (Flask)
```bash
cd "/home/melivin/Desktop/4 /Phase-4-final-project"
pipenv run python game-logic.py
```

### 2. Start the Frontend (React)
```bash
cd "/home/melivin/Desktop/4 /Phase-4-final-project/my-app"
npm install
npm start
```

## What's Fixed

### ✅ Login Page
- Added player name input for both players
- Clean, responsive design
- Form validation

### ✅ Game Logic Fixed
- Players can only move forward (no random jumping)
- Proper snake and ladder mechanics
- Win condition: exactly reach position 100
- Can't move beyond 100 without exact dice roll

### ✅ Game Features
- Turn-based gameplay
- Real-time position tracking
- Snake and ladder animations
- Win detection and celebration
- Play again functionality

## Game Rules
1. Enter player names to start
2. Players take turns rolling dice
3. Move forward by dice value
4. Snakes slide you down, ladders climb you up
5. Must roll exact number to reach 100
6. First to reach 100 wins!

## Backend API Endpoints
- `POST /api/roll-dice` - Get random dice value (1-6)
- `POST /api/check-position` - Check for snakes/ladders
- `POST /api/move-player` - Validate and execute move
- `POST /api/game-status` - Check win condition