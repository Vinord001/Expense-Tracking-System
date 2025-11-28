import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./src/config/db.js";

// Import route modules
import authRoutes from "./src/routes/auth.js";
import expensesRoutes from "./src/routes/expenses.js";
import incomesRoutes from "./src/routes/incomes.js";
import budgetsRoutes from "./src/routes/budgets.js";
import analyticsRoutes from "./src/routes/analytics.js";
import savingsRoutes from "./src/routes/savings.js";
import profileRoutes from "./src/routes/profile.js";   // ✅ FIXED — Added correct profile route

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ======================
// 🔐 Middleware setup
// ======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// ======================
// 🧩 API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/incomes", incomesRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/profile", profileRoutes);   // ✅ ADDED — Profile API fully enabled

// ======================
// 🌐 External API Proxy Handler
// ======================
import fetch from "node-fetch";

const API_MAP = {
  forex: "https://api.exchangerate-api.com/v4/latest/USD",
  crypto:
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc",
  news:
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=" +
    process.env.NEWS_API_KEY,
};

app.get("/api/external/:name", async (req, res, next) => {
  const url = API_MAP[req.params.name];
  if (!url) return res.status(404).json({ error: "External API not found" });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch external API");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ======================
// 🩺 Health Check
// ======================
app.get("/", (req, res) => {
  res.json({
    message: "✅ Backend API running successfully!",
    environment: process.env.NODE_ENV || "development",
    routes: [
      "/api/auth",
      "/api/incomes",
      "/api/expenses",
      "/api/budgets",
      "/api/savings",
      "/api/profile",   // ✅ NOW INCLUDED
      "/api/analytics",
      "/api/external/:name",
    ],
  });
});

// ======================
// ⚠️ Global Error Handlers
// ======================
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack || err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ======================
// 🚀 Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
