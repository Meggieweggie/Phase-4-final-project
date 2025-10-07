from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

snakes = {16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78}
ladders = {1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100}

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)