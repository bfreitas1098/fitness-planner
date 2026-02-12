const express = require("express");
const prisma = require("./db/prisma");
console.log("Prisma client ready:", typeof prisma);

const app = express();
const PORT = 3001;

// Middleware: allows server to read JSON
app.use(express.json());

// Test route: confirms backend is working
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
