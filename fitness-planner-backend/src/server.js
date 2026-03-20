const express = require("express");
const prisma = require("./db/prisma");
console.log("Prisma client ready:", typeof prisma);

const app = express();
const PORT = 3001;

app.use(express.json());

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

app.get("/workouts/:id", async (req, res) => {
  try {
    const workoutId = Number(req.params.id);

    if (!workoutId || Number.isNaN(workoutId)) {
      return res.status(400).json({ error: "valid workoutId is required" });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: {
                setNumber: "asc",
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return res.status(400).json({ error: "Workout not found" });
    }

    res.json(workout);
  } catch (err) {
    console.error("/GET /workouts/:workoutId/exercises error:", err);
    res.status(500).json({ error: "Could not get workout" });
  }
});

app.post("/workout-exercises/:id/sets", async (req, res) => {
  try {
    const workoutExerciseId = Number(req.params.id);
    const { reps, weight } = req.body;

    if (!workoutExerciseId || Number.isNaN(workoutExerciseId)) {
      return res
        .status(400)
        .json({ error: "valid workoutExercieId is required" });
    }

    if (!reps || typeof reps !== "number") {
      return res.status(400).json({ error: "valid number of reps required" });
    }

    if (weight === undefined || typeof weight !== "number") {
      return res.status(400).json({ error: "weight must be a number" });
    }

    const lastSet = await prisma.set.findFirst({
      where: { workoutExerciseId },
      orderBy: { setNumber: "desc" },
    });

    const nextSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

    const newSet = await prisma.set.create({
      data: {
        workoutExerciseId,
        setNumber: nextSetNumber,
        reps,
        weight,
      },
    });

    res.status(201).json(newSet);
  } catch (err) {
    console.error("/POST workout-exercises/:id/sets error:", err);
    res.status(500).json({ error: "Could not post sets" });
  }
});

app.post("/workouts/full", async (req, res) => {
  try {
    const { name, date, exercises } = req.body;

    // Validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "valid name is required" });
    }

    const parsedDate = new Date(date);
    if (!date || Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "valid date is required" });
    }

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res
        .status(400)
        .json({ error: "at least one exercise is required" });
    }

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        name: name.trim(),
        date: parsedDate,
      },
    });

    // Create workout exercise rows
    const workoutExercises = [];

    for (const exercise of exercises) {
      const exerciseId = exercise.exerciseId;
      const sets = exercise.sets;

      if (!exerciseId || typeof exerciseId !== "number") {
        return res.status(400).json({ error: "valid exerciseId is required" });
      }

      if (!Array.isArray(sets) || sets.length === 0) {
        return res.status(400).json({ error: "at least one set is required" });
      }

      const existingExercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
      });

      if (!existingExercise) {
        return res
          .status(400)
          .json({ error: `exerciseId ${exerciseId} does not exist` });
      }

      const workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          exerciseId: exerciseId,
        },
      });

      workoutExercises.push(workoutExercise);
    }

    res.status(201).json({
      workout,
      workoutExercises,
    });
  } catch (err) {
    console.error("/POST workouts/full error: ", err);
    res.status(500).json({ error: "Could not post full workout" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
