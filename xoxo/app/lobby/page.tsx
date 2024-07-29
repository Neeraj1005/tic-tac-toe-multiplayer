"use client";

import "./lobby.css";
import { useEffect, useState } from "react";
import WaitingPlayer from "@/component/WaitingPlayer";
import GamePlay from "@/component/game/GamePlay";
import { createGuestUser } from "@/lib/functions";
import client from "@/lib/colyseusClient";

type Player = {
  userName: string;
  sessionId: string;
  userId: string;
};

type UserProfile = {
  userName: string;
  userId: string;
  userSessionId: string;
};

export default function Lobby() {
  const [room, setRoom] = useState<any>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerList, setPlayerList] = useState<any>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [playBtn, setPlayBtn] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(3);

  const [yourSessionId, setYourSessionId] = useState<string | null>(null);

  const [playerPieces, setPlayerPieces] = useState<any>();

  const [myPiece, setMyPiece] = useState<number | null>(null);
  const [oppPiece, setOppPiece] = useState<number | null>(null);

  const [currProfile, setCurrProfile] = useState<UserProfile>();

  const handleRoom = async () => {
    try {
      const guestUser = createGuestUser();
      const socket = await client.joinOrCreate("my_room", guestUser);
      setRoom(socket);
      setPlayBtn(false);
    } catch (error) {
      console.error("Failed to join or create room:", error);
    }
  };

  useEffect(() => {
    if (room) {
      room.onMessage("yourId", (message: any) => {
        setYourSessionId(message.sessionId);
      });

      // Initial load of players
      setPlayers([...room.state.players]);

      // Listen for playerJoined messages
      room.onMessage("playerJoined", (message: Player) => {
        console.log("Player joined:", message);
        setPlayers((prevPlayers) => {
          const newPlayers = Array.isArray(message) ? message : [message];
          const updatedPlayers = [...prevPlayers];

          newPlayers.forEach((newPlayer) => {
            const existingPlayer = updatedPlayers.find(
              (player) => player.userId === newPlayer.userId
            );
            if (!existingPlayer) {
              updatedPlayers.push(newPlayer);
            }
          });

          return updatedPlayers;
        });
      });

      // room.onStateChange((newState: any) => {});

      room.onMessage("userProfile", (message: any) => {
        setCurrProfile(message);
      });

      room.onMessage("gameStart", (message: any) => {
        setPlayerPieces(message.playerPieces);

        setPlayerList(message.players);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 0) {
              clearInterval(countdownInterval);
              setStartGame(true);
              return 0;
            } else {
              return prevCountdown - 1;
            }
          });
        }, 1000);
      });
    }
  }, [room]);

  return playBtn ? (
    <div className="lobbyBox">
      <button className="button-1" onClick={() => handleRoom()}>Play</button>
    </div>
  ) : startGame ? (
    <GamePlay
      room={room}
      userProfile={currProfile}
      playerPieces={playerPieces}
      players={playerList}
    />
  ) : (
    <WaitingPlayer players={players} countdown={countdown} />
  );
}
