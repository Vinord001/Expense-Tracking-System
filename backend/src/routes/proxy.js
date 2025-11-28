import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const API_MAP = {
  api1: "https://api1.example.com/data",
  api2: "https://api2.example.com/info",
  api3: "https://api3.example.com/items",
};

router.get("/:name", async (req, res) => {
  const url = API_MAP[req.params.name];
  if (!url) return res.status(404).json({ error: "API not found" });

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
