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
const client = (0, redis_1.createClient)();
const processSubmission = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    // Code for processing Submission
    const { problem_id, code, language } = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problem_id}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);
    // Simulate processing delay
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problem_id}.`);
});
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Worker Connected to Redis");
        while (true) {
            try {
                const [key, submission] = yield client.brPop("problems", 0);
                yield processSubmission(submission);
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
        yield client.disconnect();
    }
});
startWorker();
