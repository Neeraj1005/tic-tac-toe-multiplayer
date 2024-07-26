"use client";

import Button from "@/component/Button";
import Square from "@/component/Square";
import { useEffect, useState } from "react";
import "./game.css";
import WinnerBox from "@/component/WinnerBox";
import GameplayBoard from "@/component/GameplayBoard";
import AlertBox from "../AlertBox";

function GamePlay({ room, userProfile, playerPieces }: any) {
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("x");
  const [winner, setWinner] = useState<any>(null);

  const userSessId = userProfile?.userSessionId;
  const [myPiece, setMyPiece] = useState<any>(null);
  const [oppPiece, setOppPiece] = useState<any>(null);

  const [alertMessage, setAlertMessage] = useState<boolean>(false);

  const [playerTurn, setPlayerTurn] = useState<number>(0);

  const gameboxClick = (ind: any) => {
    if (myPiece == playerTurn) {
      room.send("boxClicked", {
        myPiece: myPiece,
        position: ind,
      });

      if (squares[ind] || winner) {
        return;
      }

      const s: any[] = squares;
      s[ind] = turn;
      setSquares(s);
      setTurn(turn);

      room.onMessage("matchResult", (message: any) => {
        setWinner(message.winner);
      });

      room.onMessage("client_left", (message: any) => {
        console.log("client is left>>>>>>>>>>>", message);
      });
    } else {
      setAlertMessage(true);
      setTimeout(() => {
        setAlertMessage(false);
      }, 2500);
    }
  };

  const resetGame = () => {
    room.send("resetClicked", {
      board: Array(9).fill(""),
    });
    // setSquares(Array(9).fill(""));
    // setTurn("x");
  };

  useEffect(() => {
    if (room) {
      if (playerPieces.x == userSessId) {
        setMyPiece(0);
        setOppPiece(1);
        setTurn("x");
      } else if (playerPieces.y == userSessId) {
        setMyPiece(1);
        setOppPiece(0);
        setTurn("o");
      }

      room.onMessage("playerTurn", (message: any) => {
        console.log("current player turn is: ", message.playerTurn);
        setPlayerTurn(message.playerTurn);
      });

      room.onMessage("otherPlayerMove", (message: any) => {
        setSquares(message.board);
        if (message.playerTurn == 1) {
        } else {
        }
      });

      room.onMessage("resetGame", (message: any) => {
        setSquares(message.board);
        setWinner(null);
      });
    }
  }, [room, playerPieces, playerTurn, userSessId, squares, turn]);

  return (
    <div className="mainBox">
      <div className="headerContainer">
        <div>
          <h1 className="circle-sketch-highlight">
            XOXO- <span className="">{myPiece === 0 ? "x" : "o"}</span>
          </h1>
        </div>
        <div className="highlight-container">
          <span className="highlight">
            {playerTurn === myPiece
              ? "Your Turn"
              : "Opponent's Turn"}
          </span>
        </div>
        <div>
          <span className="textClass">
            Welcome{" "}
            <span className="circle-sketch-highlight textClass">
              <span className="">{userProfile?.userName}</span>
            </span>
          </span>
        </div>
      </div>

      {/* <Button resetGame={resetGame} /> */}

      <div className="gameContainer">
        <GameplayBoard updateSquares={gameboxClick} squares={squares} />

        <div className={`turn ${playerTurn == 0 ? "left" : "right"}`}>
          <Square clsName="x" />
          <Square clsName="o" />
        </div>

        <WinnerBox resetGame={resetGame} winner={winner} />
      </div>

      {alertMessage && <AlertBox />}
    </div>
  );
}

export default GamePlay;
