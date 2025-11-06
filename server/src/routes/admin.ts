import { Router } from "express";
import { auth } from "../authMiddleware";
import { requireRole } from "../authMiddleware";
import { pool } from "../db";

const router = Router();

/**
 * Assign a role to a user (Admin Only)
 * body: { user_id: number, role_name: string }
 */
router.post("/assign-role", auth, requireRole("admin"), async (req, res) => {
  try {
    const { user_id, role_name } = req.body;

    // Find role ID
    const role = await pool.query(
      `SELECT role_id FROM Roles WHERE role_name = $1`,
      [role_name]
    );
    if (!role.rows.length) return res.status(400).send("Invalid role");

    // Assign role (avoid duplicates)
    await pool.query(
      `INSERT INTO UserRoles(user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [user_id, role.rows[0].role_id]
    );

    res.send("Role assigned successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error assigning role");
  }
});

/**
 * Get all users with their assigned roles (Admin Only)
 */
router.get("/users", auth, requireRole("admin"), async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.user_id, 
        u.username, 
        COALESCE(array_agg(r.role_name) FILTER (WHERE r.role_name IS NOT NULL), '{}') AS roles
      FROM Users u
      LEFT JOIN UserRoles ur ON u.user_id = ur.user_id
      LEFT JOIN Roles r ON ur.role_id = r.role_id
      GROUP BY u.user_id
      ORDER BY u.user_id;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

export default router;
