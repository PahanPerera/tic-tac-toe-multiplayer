import { GameClient } from "./GameClient.js";

const updateView = ({ symbol, msg }) => {
  let text = "";
  if (symbol) text = `You symbol is (${symbol}) <br/> ${msg}`;
  if (!symbol) text = `${msg}`;
  document.querySelector("#msg").innerHTML = text;
};

const notifyView = (action, payload) => {
  if (action === "NOT_CONNECTED") {
    updateView({ msg: `Please click "CONNECT" to play` });
  }
  if (action === "CONNECTED") {
    updateView({ symbol: payload.symbol, msg: `Waiting for Others..` });
  }
  if (action === "MY_TURN") {
    updateView({ symbol: payload.symbol, msg: `Your  Turn...` });
  }
  if (action === "THEIR_TURN") {
    updateView({ symbol: payload.symbol, msg: `Others' turn.. Wait` });
  }
  if (action === "DISCONNECTED") {
    updateView({ msg: `Please click "CONNECT" to play` });
  }
};

const notifyServer = ({ x, y, symbol }) => {
  socket.emit("action", {
    symbol,
    location: [x, y],
  });
};

const updateGridView = (
  gameState = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
) => {
  for (let x = 0; x < gameState.length; x++) {
    for (let y = 0; y < gameState.length; y++) {
      document.getElementById(`${x}-${y}`).innerHTML =
        gameState[x][y] == 0 ? "" : gameState[x][y];
    }
  }
};

const gameClient = new GameClient({ notifyView, notifyServer, updateGridView });

const socket = io("ws://", {
  autoConnect: false,
});

socket.on("init", ({ symbol }) => {
  gameClient.initGame({ symbol });
});

socket.on("gameState", ({ game, nextSymbol }) => {
  gameClient.updateGrid({ gameState: game });
  gameClient.handlePlayerActionChange({ nextSymbol });
});

document.querySelector("#connectBtn").addEventListener("click", () => {
  socket.connect();
});

document.querySelector("#disConnectBtn").addEventListener("click", () => {
  gameClient.handleDisconnection();
  socket.disconnect();
});

document.querySelector("#grid").addEventListener("click", (e) => {
  const [x, y] = String(e.target.id).split("-");
  gameClient.handlePlayerAction({ x, y });
});
