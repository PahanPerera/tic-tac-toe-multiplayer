import { Game } from "./Game.js";

export class GameServer {
  constructor({ io }) {
    this.gameConnection = io;
    this.gameConnection.on("connection", this.handleNewPlayerConnection);
    this.playerConnections = {};
    const onGameStateChange = () => {
      this.gameConnection.emit("gameState", {
        game: this.game.state.get(),
        nextSymbol: this.game.nextActionableSymbol,
      });
    };

    const onNewPlayerJoined = (player) => {
      this.playerConnections[player.id].emit("init", {
        symbol: player.symbol,
      });
    };

    const onReady = () => {
      onGameStateChange();
    };
    this.game = new Game({
      onGameStateChange,
      onNewPlayerJoined,
      onReady,
    });
  }

  handleNewPlayerConnection = (socket) => {
    const id = socket.id;
    socket.on("disconnect", () => {
      this.game.removePlayer({ id });
      delete this.playerConnections[id];
    });
    socket.on("action", (action) => {
      let [x, y] = action.location;
      this.game.updatePlayerAction({ id, x, y });
    });
    this.playerConnections[id] = socket;
    this.game.addNewPlayer({ id });
  };
}
