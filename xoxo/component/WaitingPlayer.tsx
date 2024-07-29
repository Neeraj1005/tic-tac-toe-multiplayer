import React from "react";
import "../app/lobby/lobby.css";

function WaitingPlayer({ players, countdown }: any) {
  return (
    <div className="lobbyBox">
      <div>
        <h3 className="cardTitle">Lobby Room</h3>
      </div>
      <div className="waitingPlayerCard">
        {players.map((player: any, index: any) => (
          <div key={index} className="playerCard">
            {player.userName}
          </div>
        ))}
      </div>
      {countdown > 0 && <h2 className="cardTitle">Game starts in: {countdown} seconds</h2>}
    </div>
  );
}

export default WaitingPlayer;
