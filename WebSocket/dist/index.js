"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
let userCount = 0;
const app = (0, express_1.default)();
const httpServer = app.listen(8888);
const wss = new ws_1.WebSocketServer({ server: httpServer });
app.get("/", (req, res) => {
    res.send("hi there!!");
});
wss.on("connection", function connection(ws) {
    ws.on("error", (err) => {
        console.error(err);
    });
    ws.on("message", function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    console.log("user count ->", userCount);
    console.log("Hello! Message from Server");
    ws.send("message from server!!");
});
