import express from "express";

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

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1",
          prompt,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Ollama API failed: ${response.status}`);
    }

    const data = await response.json();

    const result = JSON.parse(data.response);

    res.json(result);
  } catch (err: any) {
    console.error("AI Error:", err);

    res.status(500).json({
      error: err.message || "AI processing failed",
    });
  }
});

export default airouter;