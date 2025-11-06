import { Router } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const existing = await pool.query(`SELECT user_id FROM Users WHERE username=$1`, [username]);
      if (existing.rows.length > 0) {
        return res.status(400).send("Username already exists");
      }
  
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO Users(username, password_hash) VALUES ($1,$2)`,
        [username, hash]
      );
  
      res.send("User Registered");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error registering user");
    }
  });
  
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = (await pool.query(`SELECT * FROM Users WHERE username=$1`, [username])).rows[0];
  if (!user) return res.status(404).send("User not found");

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ user_id: user.user_id }, "SECRET");
  res.json({ token });
});

export default router;
