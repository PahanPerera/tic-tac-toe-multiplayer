const socket = io("ws://localhost:3000", {
  autoConnect: false,
});

let SYMBOL = "";
let GAME_STATE = 0;
let IS_LOCKED = true;

socket.on("init", (initMsg) => {
  console.log(initMsg);
  SYMBOL = initMsg.symbol;
  updateMsg(`Waiting for other`);
});

socket.on("gameState", (gameState) => {
  console.log(gameState);
  if (GAME_STATE === 0) {
    GAME_STATE = 1;
  }
  if (gameState.nextSymbol === SYMBOL) {
    updateMsg("Your turn..");
    IS_LOCKED = false;
  } else {
    updateMsg("Others' turn.. Wait");
    IS_LOCKED = true;
  }
  renderGrid(gameState.game);
});

document.querySelector("#connectBtn").addEventListener("click", () => {
  socket.connect();
});
document.querySelector("#disConnectBtn").addEventListener("click", () => {
  clearMsg('Please click "CONNECT" to pay');
  socket.disconnect();
});

document.querySelector("#grid").addEventListener("click", (e) => {
  if (IS_LOCKED) return;
  if (e.target.id) {
    socket.emit("action", {
      symbol: SYMBOL,
      location: String(e.target.id).split("-"),
    });
  }
});

const renderGrid = (gameState) => {
  for (let x = 0; x < gameState.length; x++) {
    for (let y = 0; y < gameState.length; y++) {
      document.getElementById(`${x}-${y}`).innerHTML =
        gameState[x][y] == 0 ? "" : gameState[x][y];
    }
  }
};

const updateMsg = (msg) => {
  document.querySelector(
    "#msg"
  ).innerHTML = `You symbol is (${SYMBOL}) <br/> ${msg}`;
};

const clearMsg = (msg) => {
  document.querySelector("#msg").innerHTML = `${msg}`;
};

clearMsg('Please click "CONNECT" to play');
