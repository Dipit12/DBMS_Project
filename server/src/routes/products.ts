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
  await pool.query(`INSERT INTO Products(name, price) VALUES($1,$2)`, [name, price]);
  res.send("Product added");
});

router.put("/:id", auth, requireRole("admin", "dataentry"), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  await pool.query(`UPDATE Products SET name=$1, price=$2 WHERE product_id=$3`, [name, price, id]);
  res.send("Product updated");
});

router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM Products WHERE product_id=$1`, [id]);
  res.send("Product deleted");
});

export default router;
