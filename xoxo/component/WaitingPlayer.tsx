import React from "react";
import "../app/lobby/lobby.css";

function WaitingPlayer({ players, countdown }: any) {
  return (
    <main className="main">
      <div className="lobbyBox">
        <div>
          <h3>Lobby Room</h3>
        </div>
        <div className="playerBox">
          {players.map((player: any, index: any) => (
            <div key={index} className="playerCard">
              {player.userName}
            </div>
          ))}
        </div>
        {countdown > 0 && <h2>Game starts in: {countdown} seconds</h2>}
      </div>
    </main>
  );
}

export default WaitingPlayer;
