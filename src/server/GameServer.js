export default class GameServer {
  constructor(io, game) {
    this.io = io;
    this.game = game;
    this.io.on("connection", this.handleOnPlayerConnected);
    this.game.whenPlayersReady = this.handleWhenPlayersReady;
    this.game.onPlayerAction = this.handleGameStateChange;
    this.game.onGameStateChange = this.handleGameStateChange;
  }

  start = () => {
    console.log("Starting GameServer...");
  };

  handleOnPlayerConnected = (socket) => {
    let newPlayer = this.game.createPlayer(socket);
    if (newPlayer) this.game.addPlayer(newPlayer);
  };

  handleWhenPlayersReady = () => {
    console.log("Players are ready.. Starting the Game");
    this.io.emit("gameState", {
      game: this.game.state,
      nextSymbol: this.game.nextActionableSymbol,
    });
  };

  handleGameStateChange = () => {
    this.io.emit("gameState", {
      game: this.game.state,
      nextSymbol: this.game.nextActionableSymbol,
    });
  };
}
