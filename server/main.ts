import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

const wss = new WebSocketServer(8080);
const connections = new Map<string, WebSocketClient>();

wss.on("connection", function (ws: WebSocketClient) {
  console.log("new connection");
  const id = nanoid();
  connections.set(id, ws);
  ws.on("message", (message: string) => {
    console.log(message);
    for (const [connId, conn] of connections) {
      if (connId === id) continue;
      conn.send(message);
    }
  });
});
