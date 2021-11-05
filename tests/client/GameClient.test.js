import { GameClient } from "../../src/client/GameClient";
import { jest } from "@jest/globals";

describe("Testing GameClient", () => {
  const notifyView = jest.fn();
  const notifyServer = jest.fn();
  const updateGridView = jest.fn();

  let gameClient;
  beforeEach(() => {
    gameClient = new GameClient({ notifyView, notifyServer, updateGridView });
  });

  test("should create gameClient object", () => {
    expect(gameClient).toBeDefined();
  });

  test("should init gameClient successfully", () => {
    gameClient.initGame({ symbol: "O" });
    expect(gameClient.symbol).toBeDefined();
  });

  test("should handle player action change successfully", () => {
    gameClient.symbol = "O";
    gameClient.handlePlayerActionChange({ nextSymbol: "O" });
    expect(gameClient.isMyTurn).toBe(true);
  });

  test("should handle player action change successfully", () => {
    gameClient.symbol = "O";
    gameClient.handlePlayerActionChange({ nextSymbol: "X" });
    expect(gameClient.isMyTurn).toBe(false);
  });

  test("should handlePlayerAction successfully", () => {
    gameClient.handlePlayerAction({ nextSymbol: "X" });
    expect(notifyServer.mock.calls.length).toBe(0);
  });
  test("should handlePlayerAction successfully", () => {
    gameClient.initGame({ symbol: "X" });
    gameClient.handlePlayerActionChange({ nextSymbol: "X" });
    gameClient.handlePlayerAction({ nextSymbol: "X" });
    expect(notifyServer.mock.calls.length).toBe(1);
  });

  test("should handleDisconnection successfully", () => {
    gameClient.handleDisconnection();
    expect(updateGridView.mock.calls.length).toBe(1);
  });

  test("should updateGrid successfully", () => {
    gameClient.updateGrid({
      gameState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    });
    expect(updateGridView.mock.calls.length).toBe(2);
  });
});
