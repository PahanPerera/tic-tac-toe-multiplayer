export default class Player {
  constructor(socket, symbol) {
    this.socket = socket;
    this.id = this.socket.id;
    this.symbol = symbol;
    this.socket.on("disconnect", () => {
      this.onDisconnected();
    });
    this.socket.on("action", (action) => {
      let [x, y] = action.location;
      this.onPlayerAction(x, y, this.symbol);
    });
    this.onDisconnected = () => {};
    this.onPlayerAction = (x, y, symbol) => {};
  }

  notifyRegister = () => {
    this.socket.emit("init", { symbol: this.symbol });
  };

  disconnect = () => {
    this.socket.disconnect();
  };
}
