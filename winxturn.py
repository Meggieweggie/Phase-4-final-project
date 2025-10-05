from flask import Flask, request, jsonify

app = Flask(__name__)


game_state = {
    "players": ["Khalid", "Aisha"],       
    "positions": {"Khalid": 0, "Aisha": 0}, 
    "current_turn": 0,                    
    "winner": None,                       
    "board_size": 100                     
}


@app.route('/move', methods=['POST'])
def move():

    if game_state["winner"]:
        return jsonify({
            "message": f"Game over! {game_state['winner']} already won!",
            "winner": game_state["winner"],
            "positions": game_state["positions"]
        })


    data = request.get_json()
    steps = data.get("steps", 0)


    player = game_state["players"][game_state["current_turn"]]


    new_position = game_state["positions"][player] + steps


    if new_position >= game_state["board_size"]:
        game_state["positions"][player] = game_state["board_size"]
        game_state["winner"] = player
        return jsonify({
            "winner": player,
            "message": f"🎉 {player} wins the game!",
            "positions": game_state["positions"]
        })


    game_state["positions"][player] = new_position


    game_state["current_turn"] = (game_state["current_turn"] + 1) % len(game_state["players"])

    return jsonify({
        "positions": game_state["positions"],
        "next_turn": game_state["players"][game_state["current_turn"]],
        "winner": game_state["winner"]
    })


if __name__ == '__main__':
    app.run(debug=True)





    