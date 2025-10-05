from flask import Flask, request, jsonify

app = Flask(__name__)

# Example game state
game_state = {
    "players": ["Khalid", "Aisha"],        # player order
    "positions": {"Khalid": 0, "Aisha": 0},  # start at square 0
    "current_turn": 0,                     # index of current player
    "winner": None,                        # no winner at start
    "board_size": 100                      # total number of squares
}


@app.route('/move', methods=['POST'])
def move():
    # if there's already a winner, stop the game
    if game_state["winner"]:
        return jsonify({
            "message": f"Game over! {game_state['winner']} already won!",
            "winner": game_state["winner"],
            "positions": game_state["positions"]
        })

    # get dice result from frontend
    data = request.get_json()
    steps = data.get("steps", 0)

    # find current player
    player = game_state["players"][game_state["current_turn"]]

    # move player forward
    new_position = game_state["positions"][player] + steps

    # check for win condition
    if new_position >= game_state["board_size"]:
        game_state["positions"][player] = game_state["board_size"]
        game_state["winner"] = player
        return jsonify({
            "winner": player,
            "message": f"🎉 {player} wins the game!",
            "positions": game_state["positions"]
        })

    # update player position
    game_state["positions"][player] = new_position

    # switch to next player turn
    game_state["current_turn"] = (game_state["current_turn"] + 1) % len(game_state["players"])

    return jsonify({
        "positions": game_state["positions"],
        "next_turn": game_state["players"][game_state["current_turn"]],
        "winner": game_state["winner"]
    })


if __name__ == '__main__':
    app.run(debug=True)





    