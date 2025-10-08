from flask import Flask, request, jsonify
import random
import uuid
from datetime import datetime

app = Flask(__name__)


games = {}


BOARD_SIZE = 100


SNAKES = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
}

LADDERS = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
}

class Game:
    def __init__(self, player_names):
        self.id = str(uuid.uuid4())
        self.players = {name: 0 for name in player_names}
        self.current_player_index = 0
        self.winner = None
        self.created_at = datetime.utcnow().isoformat()
        self.moves = []
    
    def get_current_player(self):
        return list(self.players.keys())[self.current_player_index]
    
    def roll_dice(self):
        return random.randint(1, 6)
    
    def move_player(self, player_name, dice_value):
        if self.winner:
            return {"error": "Game already finished"}
        
        if player_name != self.get_current_player():
            return {"error": f"Not {player_name}'s turn. Current turn: {self.get_current_player()}"}
        
        current_position = self.players[player_name]
        new_position = current_position + dice_value
        

        if new_position > BOARD_SIZE:

            new_position = current_position
        elif new_position == BOARD_SIZE:

            self.winner = player_name
        else:

            if new_position in SNAKES:
                new_position = SNAKES[new_position]

            elif new_position in LADDERS:
                new_position = LADDERS[new_position]
        
        self.players[player_name] = new_position
        

        move = {
            "player": player_name,
            "dice": dice_value,
            "from": current_position,
            "to": new_position,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.moves.append(move)
        

        if not self.winner:
            self.current_player_index = (self.current_player_index + 1) % len(self.players)
        
        return {
            "player": player_name,
            "dice": dice_value,
            "from": current_position,
            "to": new_position,
            "winner": self.winner
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/games', methods=['POST'])
def create_game():
    """Create a new game with specified players"""
    data = request.get_json()
    
    if not data or 'players' not in data:
        return jsonify({"error": "Players list is required"}), 400
    
    players = data['players']
    if not isinstance(players, list) or len(players) < 2:
        return jsonify({"error": "At least 2 players are required"}), 400
    
    if len(players) > 6:
        return jsonify({"error": "Maximum 6 players allowed"}), 400
    

    if len(players) != len(set(players)):
        return jsonify({"error": "Player names must be unique"}), 400
    
    game = Game(players)
    games[game.id] = game
    
    return jsonify({
        "game_id": game.id,
        "players": game.players,
        "current_player": game.get_current_player(),
        "board_size": BOARD_SIZE,
        "created_at": game.created_at
    }), 201

@app.route('/games/<game_id>', methods=['GET'])
def get_game(game_id):
    """Get current game state"""
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404
    
    game = games[game_id]
    return jsonify({
        "game_id": game.id,
        "players": game.players,
        "current_player": game.get_current_player() if not game.winner else None,
        "winner": game.winner,
        "board_size": BOARD_SIZE,
        "created_at": game.created_at,
        "moves_count": len(game.moves)
    }), 200

@app.route('/games/<game_id>/roll', methods=['POST'])
def roll_dice(game_id):
    """Roll dice for the current player"""
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404
    
    game = games[game_id]
    current_player = game.get_current_player()
    

    dice_value = game.roll_dice()
    

    result = game.move_player(current_player, dice_value)
    
    if "error" in result:
        return jsonify(result), 400
    
    return jsonify({
        "game_id": game_id,
        "player": current_player,
        "dice": dice_value,
        "from": result["from"],
        "to": result["to"],
        "winner": result["winner"],
        "next_player": game.get_current_player() if not result["winner"] else None
    }), 200

@app.route('/games/<game_id>/moves', methods=['GET'])
def get_moves(game_id):
    """Get all moves for a game"""
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404
    
    game = games[game_id]
    return jsonify({
        "game_id": game_id,
        "moves": game.moves
    }), 200

@app.route('/games', methods=['GET'])
def list_games():
    """List all active games (with pagination)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    

    game_ids = list(games.keys())
    

    start = (page - 1) * per_page
    end = start + per_page
    paginated_ids = game_ids[start:end]
    
    game_list = []
    for gid in paginated_ids:
        game = games[gid]
        game_list.append({
            "game_id": game.id,
            "players_count": len(game.players),
            "current_player": game.get_current_player() if not game.winner else None,
            "winner": game.winner,
            "created_at": game.created_at
        })
    
    return jsonify({
        "games": game_list,
        "total": len(game_ids),
        "page": page,
        "per_page": per_page,
        "total_pages": (len(game_ids) + per_page - 1) // per_page
    }), 200

@app.route('/games/<game_id>', methods=['DELETE'])
def delete_game(game_id):
    """Delete a game"""
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404
    
    del games[game_id]
    return jsonify({"message": "Game deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
