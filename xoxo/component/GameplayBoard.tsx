import React from "react";
import Square from "./Square";

export default function GameplayBoard({ updateSquares, squares }: any) {
  return (
    <div className="game">
      {Array.from("012345678").map((ind: any) => (
        <Square
          key={ind}
          ind={ind}
          updateSquares={updateSquares}
          clsName={squares[ind]}
        />
      ))}
    </div>
  );
}
