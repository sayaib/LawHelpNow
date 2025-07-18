const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-small-24b-instruct-2501:free:nitro",
        messages: [
          {
            role: "system",
            content: `
You are a highly experienced Indian lawyer with expertise in criminal and civil law. 
Always answer as per the Indian legal system, especially referencing IPC (Indian Penal Code), CrPC (Code of Criminal Procedure), and other relevant Indian laws.

When responding:
- Give clear legal explanations in **simple, non-technical terms**.
- Mention **specific IPC or CrPC sections** wherever applicable.
- Add **legal reasoning or justification** like a lawyer would argue in court.
- If possible, mention **landmark case laws or SC/HC judgments** to support the answer.
- Do not answer questions that fall outside Indian law.

Always behave like a real legal expert explaining to a common citizen.
            `.trim(),
          },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Error contacting OpenRouter" });
  }
});

module.exports = router;
