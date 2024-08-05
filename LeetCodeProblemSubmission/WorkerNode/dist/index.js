"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const ws_1 = require("ws");
const redisClient = (0, redis_1.createClient)();
const pubClient = (0, redis_1.createClient)();
const subClient = (0, redis_1.createClient)();
// Web Socket connection
const wss = new ws_1.WebSocketServer({ port: 8080 });
const connection = new Map();
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const messageString = message.toString(); // Convert Buffer to string
        const { userId } = JSON.parse(messageString); // Parse the string as JSON
        connection.set(userId, ws);
    });
});
const processSubmission = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received submission: ${submission}`); // Log the submission
    try {
        const { problem_id, code, language, userId } = JSON.parse(submission);
        console.log(`Processing Submission for problemId ${problem_id}...`);
        console.log(`code ${code}`);
        console.log(`Language: ${language}`);
        const res = yield checkProblem(problem_id, code, language);
        if (res == null) {
            console.log("Submission Failed");
        }
        console.log(`Finished Processing submission for ${problem_id}. Result: ${res}`);
        // Publish to redis channel
        const response = JSON.stringify({ problem_id, res, userId });
        yield pubClient.publish("submissionResult", response);
    }
    catch (error) {
        console.error("Error processing submission:", error);
    }
});
// Check the problem logic
const checkProblem = (problem_id, code, language) => __awaiter(void 0, void 0, void 0, function* () {
    // Processing Delay
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate Result
    const result = ["Accepted", "TLE", "Rejected"];
    // For Testing Sending Random Status
    return result[Math.floor(Math.random() * result.length)];
});
// Logic to startWorker
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        yield pubClient.connect();
        yield subClient.connect();
        console.log("Worker Connected with Redis");
        subClient.subscribe("submissionResults", (message) => {
            const { userId, res, problem_id } = JSON.parse(message);
            const ws = connection.get(userId);
            if (ws) {
                ws.send(JSON.stringify({ problem_id, res }));
            }
        });
        while (true) {
            try {
                // brpop from Redis Queue
                const result = yield redisClient.brPop("problems", 0);
                if (result) {
                    // Handle the object with `key` and `element` properties
                    const key = result.key;
                    const submission = result.element;
                    yield processSubmission(submission);
                }
            }
            catch (error) {
                console.error("Error processing submission:", error);
            }
        }
    }
    catch (error) {
        console.error("Failed to connect to Redis", error);
    }
    finally {
        yield redisClient.disconnect();
        yield pubClient.disconnect();
        yield subClient.disconnect();
    }
});
// Start the worker node
startWorker();
