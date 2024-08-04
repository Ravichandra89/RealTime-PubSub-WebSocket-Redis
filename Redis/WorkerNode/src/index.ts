import { createClient } from "redis";

const client = createClient();

const processSubmission = async (submission: string) => {
  // Code for processing Submission
  const { problem_id, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problem_id}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problem_id}.`);
};

const startWorker = async () => {
  try {
    await client.connect();
    console.log("Worker Connected to Redis");

    while (true) {
      try {
        const [key, submission] = await client.brPop("problems", 0);
        await processSubmission(submission);
      } catch (error) {
        console.error("Error processing submission:", error);
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  } finally {
    await client.disconnect();
  }
};

startWorker();
