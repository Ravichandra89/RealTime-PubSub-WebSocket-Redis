import { createClient } from "redis";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.post("/deploy", async (req, res) => {
  const problem_id = req.body.problem_id;
  const code = req.body.code;
  const language = req.body.language;

  try {
    await client.lPush(
      "problem",
      JSON.stringify({ code, language, problem_id })
    );
    res.status(200).send("Submission Recived & Stored");
  } catch (error) {
    console.error("Redis Queue Error", error);
    res.status(500).send("Failed to Store Submission");
  }
});

const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log(`Server is Running on Port ${port}`);
    });
  } catch (error) {
    // Show the error
    console.error("Failed to Connect Redis", error);
  }
};

// Call Start Server function
startServer();
