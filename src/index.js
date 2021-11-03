import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import Game from "./server/Game.js";
import GameServer from "./server/GameServer.js";
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static(path.join(path.resolve(), "src", "client")));

new GameServer(io, new Game()).start();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
