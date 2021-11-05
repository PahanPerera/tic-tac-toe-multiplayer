export class GameClient {
  constructor({ notifyView, notifyServer, updateGridView }) {
    this.symbol = undefined;
    this.notifyView = notifyView;
    this.notifyServer = notifyServer;
    this.updateGridView = updateGridView;
    this.isMyTurn = false;
    this.notifyView("NOT_CONNECTED");
  }

  initGame = ({ symbol }) => {
    this.symbol = symbol;
    this.notifyView("CONNECTED", { symbol });
  };

  handlePlayerActionChange = ({ nextSymbol }) => {
    if (nextSymbol === this.symbol) {
      this.isMyTurn = true;
      this.notifyView("MY_TURN", { symbol: this.symbol });
    } else {
      this.isMyTurn = false;
      this.notifyView("THEIR_TURN", { symbol: this.symbol });
    }
  };

  handlePlayerAction = ({ x, y }) => {
    if (!this.isMyTurn) return;
    this.notifyServer({ action: "PLAYER_ACTION", x, y, symbol: this.symbol });
  };

  handleDisconnection = () => {
    this.updateGridView();
    this.notifyView("DISCONNECTED");
  };

  updateGrid = ({ gameState }) => {
    this.updateGridView(gameState);
  };

  update;
}
