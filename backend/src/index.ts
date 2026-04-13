import express from "express";
import cors from "cors";
import fs from "fs";
import { pool } from "./db";
import studentRoutes from "./routes/student";
import staffRoutes from "./routes/staff";
import adminRoutes from "./routes/admin";

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const message = `${new Date().toISOString()} REQ ${req.method} ${req.url} content-type:${req.headers["content-type"]}\n`;
  fs.appendFileSync("./backend-debug.log", message);
  console.log(
    "received request:",
    req.method,
    req.url,
    req.headers["content-type"],
  );
  next();
});

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ Test DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/students", studentRoutes);
app.use("/staff", staffRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
