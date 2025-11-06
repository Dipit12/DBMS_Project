import { Router } from "express";
import { auth } from "../authMiddleware";
import { requireRole } from "../authMiddleware";
import { pool } from "../db";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config()

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get("/", auth, requireRole("admin"), async (req, res) => {
  try {
    // Fetch recent logs
    const { rows: logs } = await pool.query(`
      SELECT user_id, action, table_name, timestamp
      FROM AuditLogs
      ORDER BY timestamp DESC
      LIMIT 200
    `);

    // Summarize numeric behavior
    const summary = logs.reduce((acc: any, l: any) => {
      const key = `${l.user_id}:${l.action}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const analysisPrompt = `
You are a database security analysis AI. Analyze behavioral patterns and detect suspicious / abnormal operations.

Recent Activity Summary:
${JSON.stringify(summary, null, 2)}

Red flags to look for:
- A dataentry or guest user performing DELETE operations
- A user performing many actions in a short time
- A single user dominating all actions
- Sudden spikes in DELETE or UPDATE
- Any abnormal behavior

Return result in this format:
Status: SUSPICIOUS or NORMAL
Reason: <short reasoning>
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a cybersecurity database auditor." },
        { role: "user", content: analysisPrompt }
      ]
    });

    res.json({ analysis: completion.choices[0]?.message?.content || "" });

  } catch (err) {
    console.error(err);
    res.status(500).send("AI analysis failed");
  }
});

export default router;
