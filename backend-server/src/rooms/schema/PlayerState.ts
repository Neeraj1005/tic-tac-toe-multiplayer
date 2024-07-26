import { Schema, type } from "@colyseus/schema";

class Player extends Schema {
  @type("string")
  userName: string;

  @type("string")
  sessionId: string;

  @type("string")
  userId: string;
}

export { Player };
