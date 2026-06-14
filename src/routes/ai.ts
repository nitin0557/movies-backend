import express from "express";
import axios from "axios";

const airouter = express.Router();

airouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are a movie assistant.

Return ONLY valid JSON.

Schema:

{
  "action":"fill_form",
  "movie":{
      "title":"",
      "type":"Movie",
      "director":"",
      "duration":"",
      "yearOrTime":"",
      "budget":"",
      "location":"",
      "notes":"",
      "posterUrl":""
  }
}

User Request:
${message}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false,
      }
    );

    const result = JSON.parse(response.data.response);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "AI processing failed",
    });
  }
});

export default airouter;