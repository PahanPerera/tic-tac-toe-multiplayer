import Player from "./Player.js";

export default class Game {
  constructor() {
    this.players = new Map();
    this.symbols = [
      {
        value: "O",
        isAvailable: true,
      },
      {
        value: "X",
        isAvailable: true,
      },
    ];
    this.nextActionableSymbol = "O";
    this.whenPlayersReady = () => {};
    this.onPlayerAction = () => {};
    this.onGameStateChange = () => {};
    this.resetGameState();
  }

  resetGameState = () => {
    this.state = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.onGameStateChange();
  };

  updateGameState = (newState) => {
    this.state = newState;
    this.onGameStateChange();
  };

  getNextAvailableSymbol = () => {
    if (this.players.size > 1) return null;
    let next = this.symbols.find((s) => s.isAvailable);
    next.isAvailable = false;
    return next.value;
  };

  createPlayer = (socket) => {
    const nextSymbol = this.getNextAvailableSymbol();
    if (!nextSymbol) return;
    return new Player(socket, nextSymbol);
  };

  addPlayer = (player) => {
    console.log(`Adding a new Player ${player.id} ${player.symbol}`);
    this.players.set(player.id, player);
    player.notifyRegister();
    player.onPlayerAction = this.handlePlayerAction;
    player.onDisconnected = () => {
      this.handlePlayerDisConnected(player);
    };
    if (this.players.size === 2) this.whenPlayersReady();
  };

  handlePlayerAction = (x, y, symbol) => {
    this.state[x][y] = symbol;
    this.updateGameState(this.state);
    this.nextActionableSymbol = symbol === "O" ? "X" : "O";
    this.onPlayerAction();
  };

  handlePlayerDisConnected = (player) => {
    let symbol = this.symbols.find((s) => s.value === player.symbol);
    symbol.isAvailable = true;
    this.players.delete(player.id);
    this.resetGameState();
  };
}
