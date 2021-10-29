import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static(path.join(path.resolve(), "src", "client")));

const initGameState = () => {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
};
let GAME_STATE = initGameState();

let PAYER_SYMBOLS = ["O", "X"];
let PAYERS_COUNT = 0;

const handleOnConnect = (socket) => {
  if (PAYERS_COUNT < 2) {
    socket.emit("init", {
      symbol: PAYER_SYMBOLS[PAYERS_COUNT],
    });
    PAYERS_COUNT++;
    if (PAYERS_COUNT === 2) {
      io.emit("gameState", {
        game: GAME_STATE,
        nextSymbol: "O",
      });
    }
  }
  socket.on("action", handleOnAction);
  socket.on("disconnect", handleOnDisconnect);
};

const handleOnAction = (actionMsg) => {
  let [x, y] = actionMsg.location;
  GAME_STATE[x][y] = actionMsg.symbol;
  io.emit("gameState", {
    game: GAME_STATE,
    nextSymbol: actionMsg.symbol === "O" ? "X" : "O",
  });
};

const handleOnDisconnect = () => {
  PAYERS_COUNT--;
  if (PAYERS_COUNT === 0) GAME_STATE = initGameState();
};

io.on("connection", handleOnConnect);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("listening on *:3000");
});
