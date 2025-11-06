import { Router } from "express";
import { auth } from "../authMiddleware";
import { pool } from "../db";

const router = Router();

router.get("/", auth, async (_, res) => {
  const result = await pool.query("SELECT * FROM AuditLogs ORDER BY timestamp DESC LIMIT 50");
  res.json(result.rows);
});

export default router;
