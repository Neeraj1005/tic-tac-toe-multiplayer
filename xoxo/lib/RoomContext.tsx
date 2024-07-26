"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Room } from "colyseus.js";

type RoomContextType = {
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
