// import { Router } from "express";
// import { pool } from "../db";
// import { auth, requireRole } from "../authMiddleware";

// const router = Router();

// // VIEW PRODUCTS (everyone logged in can view)
// router.get("/", auth, async (req, res) => {
//   const result = await pool.query("SELECT * FROM Products ORDER BY product_id");
//   res.json(result.rows);
// });

// // ADD PRODUCT (admin + dataentry only)
// router.post("/", auth, requireRole("admin", "dataentry"), async (req, res) => {
//   const { name, price } = req.body;

//   await pool.query(
//     "INSERT INTO Products(name, price) VALUES($1, $2)",
//     [name, price]
//   );

//   res.send("Product added");
// });

// // UPDATE PRODUCT (admin + dataentry only)
// router.put("/:id", auth, requireRole("admin", "dataentry"), async (req, res) => {
//   const { id } = req.params;
//   const { name, price } = req.body;

//   await pool.query(
//     "UPDATE Products SET name=$1, price=$2 WHERE product_id=$3",
//     [name, price, id]
//   );

//   res.send("Product updated");
// });

// // DELETE PRODUCT (admin only)
// router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
//   const { id } = req.params;
//   await pool.query("DELETE FROM Products WHERE product_id=$1", [id]);
//   res.send("Product deleted");
// });

// export default router;

import { Router } from "express";
import { pool } from "../db";
import { auth, requireRole } from "../authMiddleware";

const router = Router();

router.get("/", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM Products ORDER BY product_id");
  res.json(result.rows);
});

router.post("/", auth, requireRole("admin", "dataentry"), async (req, res) => {
  const { name, price } = req.body;
  const userId = (req as any).user_id;
  try{
    const result = await pool.query(`INSERT INTO Products(name, price) VALUES($1,$2) RETURNING *`, [name, price]);

    const newProduct = result.rows[0];
    await pool.query(
      `INSERT INTO AuditLogs(user_id, action, table_name,new_data) VALUES($1, $2, $3, $4)`,
      [userId,"INSERT", "Products", JSON.stringify(newProduct) ]
    );
    res.send("Product added");
  }catch(err){
    console.error("Error inserting product or logging audit:", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", auth, requireRole("admin", "dataentry"), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const result = await pool.query(`UPDATE Products SET name=$1, price=$2 WHERE product_id=$3`, [name, price, id]);
  res.send("Product updated");

});

router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user_id;
  try{
    const productList = await pool.query(`SELECT * FROM Products WHERE product_id = $1`, [id]);
    const oldProduct = productList.rows[0];
    await pool.query(`DELETE FROM Products WHERE product_id=$1`, [id]);
    await pool.query(`INSERT INTO AuditLogs(user_id, action, table_name, old_data) VALUES($1, $2, $3, $4)`,
      [userId, "DELETE", "Products", JSON.stringify(oldProduct)]
    );
  }catch(err){
    console.error("Error deleting product or logging audit:", err);
    return res.status(500).send("Internal Server Error");
  }

  res.send("Product deleted");
});

export default router;
