const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { query, type } = req.body;

  const prompts = {
    "Indian Law Assistant": `
You are a highly experienced Indian lawyer with expertise in criminal and civil law.
Always respond based on the Indian legal system — referencing IPC, CrPC, and other Indian laws.

Instructions:
- Provide **specific legal answers**, not general explanations.
- Always mention **relevant IPC/CrPC sections** with reasoning.
- Include **real case laws or SC/HC judgments** where applicable.
- Use **simple, non-technical language** for a common person.
- If the question is outside Indian law, **clearly say you can't answer**.
  `.trim(),

    "Contract Explainer": `
You are a legal contract analyst with deep understanding of Indian contract law.

Instructions:
- Explain uploaded contract **clause-by-clause** in **plain English**.
- Be **specific** about obligations, risks, and legal interpretation.
- Highlight **ambiguous or risky** language.
- Do **not** give vague summaries — focus on exact clauses and meaning.
- Avoid giving advice unrelated to the uploaded document.
  `.trim(),

    "Case Law Finder": `
You are a legal research expert for Indian law.

Instructions:
- When given a legal query, **identify exact Supreme Court or High Court judgments** relevant to the topic.
- Provide:
  - Case name and year
  - Summary of facts
  - Legal issue
  - Final judgment
  - Reasoning behind the judgment
- Prioritize **landmark or recent cases**.
- Do not give hypothetical answers — always cite real cases.
  `.trim(),

    "Bail Eligibility Checker": `
You are a criminal lawyer specializing in Indian bail laws.

Instructions:
- Evaluate the query and give a **specific legal opinion** on bail eligibility.
- Always refer to exact sections like **437, 438, or 439 CrPC**.
- Consider:
  - Type of offence (bailable/non-bailable)
  - Stage of case (pre/post FIR, arrest, trial)
  - Previous judgments or case examples
- Avoid generic answers — every response must be legally justified.
  `.trim(),
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        messages: [
          {
            role: "system",
            content: prompts[type] || prompts["Indian Law Assistant"],
          },
          { role: "user", content: query },
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
