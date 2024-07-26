import { Schema, Context, type, ArraySchema } from "@colyseus/schema";
import { Player } from "./PlayerState";

export class MyRoomState extends Schema {
  @type("number")
  playerTurn: number;

  @type(["string"])
  board = new ArraySchema<string>();

  @type([Player])
  players = new ArraySchema<Player>();

  constructor() {
    super();
    this.playerTurn = 0;
    this.board = new ArraySchema("", "", "", "", "", "", "", "", "");
  }

  checkWinner(): string | null {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of combos) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    return null;
  }

  checkEndTheGame(): boolean {
    for (const board of this.board) {
      if (!board) return false;
    }
    return true;
  }
}
