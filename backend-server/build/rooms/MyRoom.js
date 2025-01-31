"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const core_1 = require("@colyseus/core");
const MyRoomState_1 = require("./schema/MyRoomState");
const PlayerState_1 = require("./schema/PlayerState");
class MyRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
        this.playerPieces = {
            x: "",
            y: "",
        };
        this.playerTurn = 0;
    }
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        console.log(`game room is created you room id is: ${this.roomId}`, options);
        this.onMessage("addPlayer", (client, message) => {
            const player = new PlayerState_1.Player();
            player.sessionId = client.sessionId;
            player.userName = message.name;
            player.userId = options.userId;
            this.state.players.push(player);
        });
        this.broadcast("playerJoined", this.state.players);
        // box clicked event handle
        this.onMessage("boxClicked", (client, data) => {
            console.log("box clicked>>>>>>>>>>>>>>", data);
            if (data.myPiece == 1) {
                this.state.board[data.position] = "o";
            }
            else {
                this.state.board[data.position] = "x";
            }
            const winner = this.state.checkWinner();
            console.log("winner is>>>>>>>>>>>>>>>>", winner);
            if (winner) {
                this.broadcast("matchResult", {
                    winner: winner,
                });
            }
            else if (this.state.checkEndTheGame()) {
                this.broadcast("matchResult", {
                    winner: "x | o",
                });
            }
            else {
                this.clients.forEach((clientData, index) => {
                    const clickedUserSessionId = client.sessionId;
                    if (clickedUserSessionId !== clientData.sessionId) {
                        clientData.send("otherPlayerMove", {
                            playerTurn: this.playerTurn,
                            element: data.position,
                            board: this.state.board,
                        });
                    }
                });
                if (data.myPiece === this.playerTurn && this.playerTurn === 0) {
                    this.playerTurn = 1;
                    this.state.playerTurn = this.playerTurn;
                }
                else if (data.myPiece === this.playerTurn && this.playerTurn === 1) {
                    this.playerTurn = 0;
                    this.state.playerTurn = this.playerTurn;
                }
                this.broadcast("playerTurn", {
                    playerTurn: this.playerTurn,
                });
            }
        });
        // reset game
        this.onMessage("resetClicked", (client, data) => {
            this.state.board = data.board;
            this.broadcast("resetGame", {
                board: this.state.board,
            });
        });
    }
    onJoin(client, options) {
        const player = new PlayerState_1.Player();
        player.userName = options.userName;
        player.sessionId = client.sessionId;
        player.userId = options.userId;
        // Add the new Player to the room state
        this.state.players.push(player);
        client.send("yourId", {
            sessionId: client.sessionId,
            roomId: this.roomId,
        });
        client.send("userProfile", {
            userName: options.userName,
            userId: options.userId,
            userSessionId: client.sessionId,
        });
        this.broadcast("playerJoined", this.state.players);
        console.log(this.state.players.length, this.maxClients, "start condition");
        if (this.state.players.length === this.maxClients) {
            this.playerPieces.y = client.sessionId;
            this.broadcast("gameStart", {
                players: this.state.players,
                playerPieces: this.playerPieces,
            });
        }
        else {
            this.playerPieces.x = client.sessionId;
        }
    }
    onLeave(client, consented) {
        console.log(`Client ${client.sessionId} left!`);
        this.broadcast("client_left", { sessionId: client.sessionId });
        if (consented) {
            console.log(`Client ${client.sessionId} left voluntarily.`);
        }
        else {
            console.log(`Client ${client.sessionId} disconnected unexpectedly.`);
        }
    }
    onDispose() {
        console.log(`Room ${this.roomId} is disposing...`);
    }
}
exports.MyRoom = MyRoom;
