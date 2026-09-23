import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import evaluateSpeaking from "./evaluateSpeaking.js";
import practiceFeedback from "./practiceFeedback.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Speakai jalan");
});
app.use("/api", evaluateSpeaking);
app.use("/api", practiceFeedback);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});