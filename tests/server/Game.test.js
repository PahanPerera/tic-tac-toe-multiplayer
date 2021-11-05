import { Game } from "../../src/server/Game";
import { jest } from "@jest/globals";

describe("Testing Game", () => {
  const onGameStateChange = jest.fn();
  const onNewPlayerJoined = jest.fn();
  const onReady = jest.fn();
  let game;
  beforeEach(() => {
    game = new Game({ onGameStateChange, onNewPlayerJoined, onReady });
  });

  test("should create game object", () => {
    expect(game).toBeDefined();
  });

  test("should add a new player successfully", () => {
    const mockPlayerId = "123456";
    game.addNewPlayer({ id: mockPlayerId });
    expect(game.players[mockPlayerId]).toBeDefined();
    expect(onNewPlayerJoined.mock.calls.length).toBe(1);
  });

  test("should reset game successfully", () => {
    game.resetGame();
    expect(game.nextActionableSymbol).toBe("O");
  });

  test("should remove a  player successfully", () => {
    const mockPlayerId = "123456";
    game.addNewPlayer({ id: mockPlayerId });
    game.removePlayer({ id: mockPlayerId });
    expect(game.players[mockPlayerId]).toBeUndefined();
  });

  test("should update player action successfully", () => {
    const mockPlayerId = "123456";
    game.addNewPlayer({ id: mockPlayerId });
    game.updatePlayerAction({ id: mockPlayerId, x: 0, y: 0 });
    const gridValue = game.state.get()[0][0];
    expect(gridValue).toBe("O");
  });

  test("should start the game successfully", () => {
    const mockPlayerId1 = "123456";
    const mockPlayerId2 = "987654";
    game.addNewPlayer({ id: mockPlayerId1 });
    game.addNewPlayer({ id: mockPlayerId2 });
    expect(onReady.mock.calls.length).toBe(1);
  });

  test("should not add a new player if not space", () => {
    game.playerSymbols = { O: false, X: false };
    const mockPlayerId = "123456";
    game.addNewPlayer({ id: mockPlayerId });
    expect(game.players[mockPlayerId]).toBeUndefined();
  });

  test("should change the nextActionableSymbol correctly", () => {
    const mockPlayerId1 = "123456";
    const mockPlayerId2 = "987654";
    game.addNewPlayer({ id: mockPlayerId1 });
    game.addNewPlayer({ id: mockPlayerId2 });
    game.updatePlayerAction({ id: mockPlayerId2, x: 0, y: 0 });
    expect(game.nextActionableSymbol).toBe("O");
  });

  test("should not update state if not empty", () => {
    game.state.update({ x: 0, y: 0, symbol: "X" });
    const mockPlayerId = "123456";
    game.addNewPlayer({ id: mockPlayerId });
    game.updatePlayerAction({ id: mockPlayerId, x: 0, y: 0 });
    const gridValue = game.state.get()[0][0];
    expect(gridValue).toBe("X");
  });
});
