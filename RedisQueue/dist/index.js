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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3001;
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.log("Redis Client Error", err));
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem_id = req.body.problem_id;
    const code = req.body.code;
    const language = req.body.language;
    try {
        yield client.lPush("problem", JSON.stringify({ code, language, problem_id }));
        res.status(200).send("Submission Recived & Stored");
    }
    catch (error) {
        console.error("Redis Queue Error", error);
        res.status(500).send("Failed to Store Submission");
    }
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connected to Redis");
        app.listen(3000, () => {
            console.log(`Server is Running on Port ${port}`);
        });
    }
    catch (error) {
        // Show the error
        console.error("Failed to Connect Redis", error);
    }
});
// Call Start Server function
startServer();
