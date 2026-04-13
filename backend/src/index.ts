import express from "express";
import cors from "cors";
import { pool } from "./db";
import studentRoutes from "./routes/student";
import staffRoutes from "./routes/staff";
import adminRoutes from "./routes/admin";

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true
}));

// Logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );
  next();
});

// Root
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Test DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/students", studentRoutes);
app.use("/staff", staffRoutes);
app.use("/admin", adminRoutes);

// Port (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
