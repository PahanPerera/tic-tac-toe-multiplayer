class Player {
  constructor({ id, symbol }) {
    this.id = id;
    this.symbol = symbol;
  }
}

class GameState {
  constructor({ onGameStateChange }) {
    this.initState = () => {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    };
    this.state = this.initState();
    this.onGameStateChange = onGameStateChange;
  }

  update = ({ x, y, symbol }) => {
    this.state[x][y] = symbol;
    this.onGameStateChange();
  };

  reset = () => {
    this.state = this.initState();
    this.onGameStateChange();
  };

  get = () => {
    return this.state;
  };

  isEmpty = ({ x, y }) => {
    return this.state[x][y] === 0;
  };
}
export class Game {
  constructor({ onGameStateChange, onNewPlayerJoined, onReady }) {
    this.state = new GameState({ onGameStateChange });
    this.onNewPlayerJoined = onNewPlayerJoined;
    this.onReady = onReady;
    this.playerSymbols = { O: true, X: true };
    this.nextActionableSymbol = "O";
    this.players = {};
  }

  nextAvailableSymbols = () => {
    let nextKey = Object.keys(this.playerSymbols).find(
      (key) => this.playerSymbols[key]
    );
    if (!nextKey) return;
    this.playerSymbols[nextKey] = false;
    return nextKey;
  };

  addNewPlayer = ({ id }) => {
    let symbol = this.nextAvailableSymbols();
    if (!symbol) return;
    let newPlayer = new Player({ id, symbol });
    console.log(`New Player with Id - ${id}, Symbol - ${symbol}`);
    this.players[id] = newPlayer;
    this.onNewPlayerJoined(newPlayer);
    if (Object.keys(this.players).length === 2) {
      this.resetGame();
      this.onReady();
    }
  };

  resetGame = () => {
    this.nextActionableSymbol = "O";
    this.state.reset();
  };

  removePlayer = ({ id }) => {
    let symbol = this.players[id].symbol;
    this.playerSymbols[symbol] = true;
    delete this.players[id];
    this.resetGame();
    console.log(`Removed Player with Id - ${id}`);
  };

  updatePlayerAction = ({ id, x, y }) => {
    if (!this.state.isEmpty({ x, y })) return;
    let player = this.players[id];
    player.symbol === "O"
      ? (this.nextActionableSymbol = "X")
      : (this.nextActionableSymbol = "O");
    this.state.update({ x, y, symbol: player.symbol });
  };
}
