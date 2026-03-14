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
    res.status(500).json({ error: "Could not get exercises" });
  }
});

app.post("/exercises", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const exercise = await prisma.exercise.create({
      data: { name: name.trim() },
    });

    res.status(201).json(exercise);
  } catch (err) {
    console.error("POST /exercises error:", err);
    res.status(500).json({ error: "Could not post exercises" });
  }
});

app.post("/workouts", async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    const workout = await prisma.workout.create({
      data: {
        name: name.trim(),
        date: new Date(date),
      },
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error("POST /exercises error:", err);
    res.status(500).json({ error: "Could not post workouts" });
  }
});

app.get("/workouts", async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: "desc",
      },
    });

    res.json(workouts);
  } catch (err) {
    console.error("GET /exercises error:", err);
    res.status(500).json({ error: "Could not get workouts" });
  }
});

app.post("/workouts/:workoutId/exercises", async (req, res) => {
  try {
    const workoutId = Number(req.params.workoutId);
    const { exerciseId } = req.body;

    if (!workoutId || Number.isNaN(workoutId)) {
      return res.status(400).json({ error: "Not a valid workoutId" });
    }
    if (!exerciseId || typeof exerciseId !== "number") {
      return res.status(400).json({ error: "exerciseId is required" });
    }

    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId,
      },
    });

    res.status(201).json(workoutExercise);
  } catch (err) {
    console.error("/POST /workouts/:workoutId/exercises error:", err);
    res.status(500).json({ error: "Could not post workout" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
