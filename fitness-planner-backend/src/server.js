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

// Routes
app.get("/exercises", async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (err) {
    console.error("GET /exercises error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/exercises", async (req, res) => {
  try {
    const { name } = req.body;

    // basic validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const exercise = await prisma.exercise.create({
      data: { name: name.trim() },
    });

    res.status(201).json(exercise);
  } catch (err) {
    console.error("POST /exercises error:", err);

    // Prevent error from duplicate names
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
