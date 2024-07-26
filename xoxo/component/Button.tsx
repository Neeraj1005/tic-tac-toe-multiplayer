"use client";

const Button = ({ resetGame }: any) => {
  return <button onClick={() => resetGame()}>New Game</button>;
};

export default Button;
