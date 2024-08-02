import express from "express";
import { WebSocket, WebSocketServer } from "ws";

let userCount = 0;

const app = express();
const httpServer = app.listen(8888);
const wss = new WebSocketServer({ server: httpServer });

app.get("/", (req, res) => {
  res.send("hi there!!");
});

wss.on("connection", function connection(ws) {
  ws.on("error", (err) => {
    console.error(err);
  });

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  console.log("user count ->", userCount);
  console.log("Hello! Message from Server");
  ws.send("message from server!!");
});
