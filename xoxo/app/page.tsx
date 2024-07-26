"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRoom = async () => {
    try {
      router.push(`/lobby`);
    } catch (error) {
      console.error("Failed to join or create room:", error);
    }
  };

  return (
    <main className="main">
      <button onClick={() => handleRoom()}>Tic-Tac-Toe</button>
    </main>
  );
}
