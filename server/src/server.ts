import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import auditRoutes from "./routes/audit";
import analyzeRoutes from "./routes/analyze";

import adminRoutes from "./routes/admin";   // ✅ <-- IMPORTANT

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/analyze", analyzeRoutes);

app.use("/products", productRoutes);
app.use("/audit", auditRoutes);
app.use("/admin", adminRoutes);            // ✅ <-- MUST BE HERE

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
