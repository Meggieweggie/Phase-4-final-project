from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Snake and ladder mappings
snakes = {16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78}
ladders = {1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100}

# Game state storage (in production, use a database)
game_sessions = {}

@app.route('/api/roll-dice', methods=['POST'])
def roll_dice():
    dice_value = random.randint(1, 6)
    return jsonify({"diceValue": dice_value})

@app.route('/api/check-position', methods=['POST'])
def check_position():
    data = request.get_json()
    position = data.get('position', 0)
    
    if position in snakes:
        new_position = snakes[position]
        return jsonify({
            "newPosition": new_position,
            "type": "snake",
            "message": f"Snake! Slide down to {new_position}"
        })
    elif position in ladders:
        new_position = ladders[position]
        return jsonify({
            "newPosition": new_position,
            "type": "ladder",
            "message": f"Ladder! Climb up to {new_position}"
        })
    else:
        return jsonify({
            "newPosition": position,
            "type": "normal",
            "message": f"Safe at {position}"
        })

@app.route('/api/game-status', methods=['POST'])
def game_status():
    data = request.get_json()
    position = data.get('position', 0)
    
    won = position >= 100
    return jsonify({"won": won})

@app.route('/api/move-player', methods=['POST'])
def move_player():
    data = request.get_json()
    current_position = data.get('currentPosition', 1)
    dice_value = data.get('diceValue', 1)
    
    new_position = current_position + dice_value
    
    # Can't go beyond 100
    if new_position > 100:
        return jsonify({
            "newPosition": current_position,
            "moved": False,
            "message": f"Need exactly {100 - current_position} to win!"
        })
    
    # Check for snakes and ladders
    final_position = new_position
    message = f"Moved to {new_position}"
    
    if new_position in snakes:
        final_position = snakes[new_position]
        message = f"Snake! Slide down from {new_position} to {final_position}"
    elif new_position in ladders:
        final_position = ladders[new_position]
        message = f"Ladder! Climb up from {new_position} to {final_position}"
    
    won = final_position >= 100
    
    return jsonify({
        "newPosition": final_position,
        "moved": True,
        "message": message,
        "won": won
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)