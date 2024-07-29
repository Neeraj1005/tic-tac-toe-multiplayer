"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoomState = void 0;
const schema_1 = require("@colyseus/schema");
const PlayerState_1 = require("./PlayerState");
class MyRoomState extends schema_1.Schema {
    constructor() {
        super();
        this.board = new schema_1.ArraySchema();
        this.players = new schema_1.ArraySchema();
        this.playerTurn = 0;
        this.board = new schema_1.ArraySchema("", "", "", "", "", "", "", "", "");
    }
    checkWinner() {
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
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }
    checkEndTheGame() {
        for (const board of this.board) {
            if (!board)
                return false;
        }
        return true;
    }
}
exports.MyRoomState = MyRoomState;
__decorate([
    (0, schema_1.type)("number")
], MyRoomState.prototype, "playerTurn", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], MyRoomState.prototype, "board", void 0);
__decorate([
    (0, schema_1.type)([PlayerState_1.Player])
], MyRoomState.prototype, "players", void 0);
