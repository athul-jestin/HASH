import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
    try {
      const message = req.body.message;
      console.log("Received message:", message);
  
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
    });
  
      res.json({ replies: response.choices[0].message.content });
    } catch (error) {
      console.error("Error processing chatbot request:", error);
      res.status(500).json({ error: "Error processing chatbot request" });
    }
  });
  
  export default router;
