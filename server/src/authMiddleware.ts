import jwt from "jsonwebtoken";
import { pool } from "./db";

export const auth = async (req: any, res: any, next: any) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).send("No Token Provided");

    const token = header.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
    req.user_id = decoded.user_id;

    // ✅ Load roles correctly
    const rolesResult = await pool.query(
      `SELECT r.role_name 
       FROM UserRoles ur
       JOIN Roles r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [req.user_id]
    );

    req.user_roles = rolesResult.rows.map(r => r.role_name);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
};

// ✅ Allow multiple roles
export const requireRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user_roles || req.user_roles.length === 0)
      return res.status(403).send("Forbidden: No roles assigned");
    // @ts-ignore
    const ok = req.user_roles.some(r => allowedRoles.includes(r));
    if (!ok) return res.status(403).send("Forbidden: Insufficient role");

    next();
  };
};
