import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const port = 8080;
let count = 0;

// Create the Http Server
const server = http.createServer((req, res) => {
  console.log(new Date() + " Received request for " + req.url);
  res.end("Hi there!!");
});

// Writing the WebSocket Server logic
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", (err) => {
    console.error(err);
  });

  // Sending message from client to server
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  console.log("User Count", ++count);
  ws.send("Hello! Message from server");
});

server.listen(port || 8989, () => {
  console.log(new Date() + " Server is running on port " + port);
});

