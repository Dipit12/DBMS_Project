import { pool } from "./db";

export async function userHasRole(user_id: number, role_name: string) {
  const result = await pool.query(
    `SELECT r.role_name 
     FROM UserRoles ur
     JOIN Roles r ON ur.role_id = r.role_id
     WHERE ur.user_id = $1`,
    [user_id]
  );

  return result.rows.some((row) => row.role_name === role_name);
}
