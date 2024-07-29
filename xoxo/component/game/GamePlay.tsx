"use client";

import { useEffect, useState } from "react";
import "./game.css";
import WinnerBox from "@/component/WinnerBox";
import GameplayBoard from "@/component/GameplayBoard";
import AlertBox from "../AlertBox";
import Image from "next/image";
import xIcon from "../../public/icons/x.png";
import oIcon from "../../public/icons/o.png";
import arrowIcon from "../../public/icons/arrow.png";

function GamePlay({ room, userProfile, playerPieces, players }: any) {
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("x");
  const [winner, setWinner] = useState<any>(null);

  const userSessId = userProfile?.userSessionId;
  const [myPiece, setMyPiece] = useState<any>(null);
  const [oppPiece, setOppPiece] = useState<any>(null);

  const [alertMessage, setAlertMessage] = useState<boolean>(false);
  const [alertMessageText, setAlertMessageText] = useState<string | null>("");

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
      showAlertBox("");
    }
  };

  const showAlertBox = (message: string | null) => {
    setAlertMessageText(message);
    setAlertMessage(true);
    setTimeout(() => {
      setAlertMessage(false);
    }, 2500);
  };

  const resetGame = () => {
    room.send("resetClicked", {
      board: Array(9).fill(""),
    });
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

      room.onMessage("notAllowed", (data: any) => {
        showAlertBox(data.message);
      });
    }
  }, [room, playerPieces, playerTurn, userSessId, squares, turn]);

  return (
    <div className="gameBox">
      <div className="leftContainer">
        {/* <div>
          <h1 className="circle-sketch-highlight">
            XOXO- <span className="">{myPiece === 0 ? "x" : "o"}</span>
          </h1>
        </div>
        <div className="highlight-container">
          <span className="highlight">
            {playerTurn === myPiece ? "Your Turn" : "Opponent's Turn"}
          </span>
        </div>
        <div>
          <span className="textClass">
            Welcome{" "}
            <span className="circle-sketch-highlight textClass">
              <span className="">{userProfile?.userName}</span>
            </span>
          </span>
        </div> */}
        <div className="playerBox">
          {players &&
            players.map((dataPlayer: any, key: number) => (
              <div className="playerInfo" key={dataPlayer.userId}>
                <div className="turnIconBox">
                  {playerTurn == key && (
                    <Image
                      src={arrowIcon}
                      width={12}
                      height={12}
                      alt="arrow icon"
                    />
                  )}
                </div>
                <div className={`playerName ${dataPlayer.sessionId == userSessId ? 'highlight-container' : ''}`}>
                  <h4 className={`${dataPlayer.sessionId == userSessId ? 'highlight' : ''}`}>
                    {dataPlayer.sessionId == userSessId
                      ? "You"
                      : dataPlayer.userName}
                  </h4>
                </div>
                <div className="playerIcon">
                  <Image
                    src={dataPlayer.isIconX ? xIcon : oIcon}
                    width={22}
                    height={22}
                    alt="icon of the avatar 0"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="gameContainer">
        <div className="gridBox">
          <GameplayBoard updateSquares={gameboxClick} squares={squares} />
        </div>
        <WinnerBox resetGame={resetGame} winner={winner} />
        {alertMessage && <AlertBox message={alertMessageText} />}
      </div>

      <div className="rightContainer"></div>
    </div>
  );
}

export default GamePlay;
