# Snakes and Ladders Game

Classic board game with React frontend and Flask backend.

## Team Responsibilities

### Gameboard & Visual Design
- 10x10 game board layout
- Snake and ladder visual elements
- Player piece positioning
- Responsive grid design

### Login and Logout Portal
- User authentication interface
- Username input form
- Session management
- Welcome/logout screens

### Dice Controls & Game UI
- Interactive dice rolling button
- Dice animation and display
- Game status messages
- Player turn indicators
- Winner announcement modal

### Game Logic & State Management (API Integration)
- Player state management
- Turn switching logic
- Move validation
- Win condition checking
- API service integration
- Game history tracking

### Flask Backend & API Endpoints
- `POST /api/roll-dice` - Generate random dice value
- `POST /api/check-position` - Check snakes/ladders
- `POST /api/game-status` - Validate win condition
- CORS configuration
- Snake and ladder mappings

## Setup

### Backend
```bash
pip install -r requirements.txt
python game-logic.py
```

### Frontend
```bash
npm install
npm start
```

## Game Rules

- Two players take turns
- Roll dice (1-6) to move
- Ladders move you up
- Snakes move you down
- Reach exactly 100 to win

