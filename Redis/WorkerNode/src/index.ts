import { createClient } from "redis";
import WebSocket, { WebSocketServer } from "ws";

const redisClient = createClient();
const pubClient = createClient();
const subClient = createClient();

// Web Socket connection
const wss = new WebSocketServer({ port: 8080 });
const connection = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const messageString = message.toString(); // Convert Buffer to string
    const { userId } = JSON.parse(messageString); // Parse the string as JSON
    connection.set(userId, ws);
  });
});

const processSubmission = async (submission: any) => {
  console.log(`Received submission: ${submission}`); // Log the submission
  try {
    const { problem_id, code, language, userId } = JSON.parse(submission);

    console.log(`Processing Submission for problemId ${problem_id}...`);
    console.log(`code ${code}`);
    console.log(`Language: ${language}`);

    const res = await checkProblem(problem_id, code, language);

    if (res == null) {
      console.log("Submission Failed");
    }

    console.log(
      `Finished Processing submission for ${problem_id}. Result: ${res}`
    );

    // Publish to redis channel
    const response = JSON.stringify({ problem_id, res, userId });

    await pubClient.publish("submissionResult", response);
  } catch (error) {
    console.error("Error processing submission:", error);
  }
};

// Check the problem logic
const checkProblem = async (problem_id: any, code: any, language: any) => {
  // Processing Delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate Result
  const result = ["Accepted", "TLE", "Rejected"];

  // For Testing Sending Random Status
  return result[Math.floor(Math.random() * result.length)];
};

// Logic to startWorker
const startWorker = async () => {
  try {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();

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
        const result = await redisClient.brPop("problems", 0);

        if (result) {
          // Handle the object with `key` and `element` properties
          const key = result.key;
          const submission = result.element;
          await processSubmission(submission);
        }
      } catch (error) {
        console.error("Error processing submission:", error);
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  } finally {
    await redisClient.disconnect();
    await pubClient.disconnect();
    await subClient.disconnect();
  }
};

// Start the worker node
startWorker();
