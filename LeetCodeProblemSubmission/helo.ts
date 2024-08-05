import { createClient } from "redis";
import { WebSocketServer } from "ws";

const redisClient = createClient();
const pubClient = createClient();  // Client for publishing results
const subClient = createClient();  // Client for subscribing to results

const wss = new WebSocketServer({ port: 8080 });
const connections = new Map();

// Maintain a map of WebSocket connections
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { userId } = JSON.parse(message);
    connections.set(userId, ws);
  });
});

const processSubmission = async (submission) => {
  const { problem_id, code, language, userId } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problem_id}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  // Simulate problem checking logic
  const result = await checkProblem(problem_id, code, language);

  console.log(`Finished processing submission for problemId ${problem_id}. Result: ${result}`);

  // Publish the result to a Redis channel
  const response = JSON.stringify({ problem_id, result, userId });
  await pubClient.publish('submissionResults', response);
};

const checkProblem = async (problemId, code, language) => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate result
  const results = ["Accepted", "TLE", "Rejected"];
  return results[Math.floor(Math.random() * results.length)];
};

const startWorker = async () => {
  try {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();
    console.log("Worker Connected to Redis");

    // Subscribe to the results channel
    subClient.subscribe('submissionResults', (message) => {
      const { userId, result, problem_id } = JSON.parse(message);
      const ws = connections.get(userId);
      if (ws) {
        ws.send(JSON.stringify({ problem_id, result }));
      }
    });

    while (true) {
      try {
        const [key, submission] = await redisClient.brPop("problems", 0);
        await processSubmission(submission);
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

startWorker();
