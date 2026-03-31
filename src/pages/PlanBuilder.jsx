import { Button, Card } from "../components/layout/ui";
import { useState, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlanBuilder() {
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch("http://localhost:3001/exercises");

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Could not load exercises");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  function toggleExercise(exercise) {
    const isAlreadySelected = workoutExercises.some(
      (workoutExercise) => workoutExercise.exerciseId === exercise.id,
    );

    if (isAlreadySelected) {
      const updatedWorkoutExercises = workoutExercises.filter(
        (workoutExercise) => workoutExercise.exerciseId !== exercise.id,
      );
      setWorkoutExercises(updatedWorkoutExercises);
    } else {
      const newWorkoutExercise = {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: [{ reps: "", weight: "" }],
      };
      setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    }
  }

  function handleSetChange(exerciseId, setIndex, field, value) {
    const updatedWorkoutExercises = workoutExercises.map((workoutExercise) => {
      if (workoutExercise.exerciseId !== exerciseId) {
        return workoutExercise;
      }

      const updatedSets = workoutExercise.sets.map((set, index) => {
        if (index !== setIndex) {
          return set;
        }

        return { ...set, [field]: value };
      });

      return { ...workoutExercise, sets: updatedSets };
    });

    setWorkoutExercises(updatedWorkoutExercises);
  }

  function addSet(exerciseId) {
    const updatedWorkoutExercises = workoutExercises.map((workoutExercise) => {
      if (workoutExercise.exerciseId !== exerciseId) {
        return workoutExercise;
      }

      return {
        ...workoutExercise,
        sets: [...workoutExercise.sets, { reps: "", weight: "" }],
      };
    });

    setWorkoutExercises(updatedWorkoutExercises);
  }

  return (
    <div style={{ maxWidth: 1100, display: "grid", gap: 14 }}>
      <Card
        title="Week Plan"
        action={<Button variant="ghost">+ Add Workout</Button>}
      >
        <div style={styles.week}>
          {DAYS.map((day) => (
            <div key={day} style={styles.dayCol}>
              <div style={styles.dayLabel}>{day}</div>

              <div style={styles.workoutCard}>
                <div style={{ fontWeight: 900 }}>Upper</div>
                <div style={styles.muted}>6 exercises</div>
              </div>

              <div style={styles.workoutCard}>
                <div style={{ fontWeight: 900 }}>Lower</div>
                <div style={styles.muted}>5 exercises</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Workout Editor">
        <div style={styles.editor}>
          <div>
            <div style={styles.label}>Workout Name</div>
            <input style={styles.input} placeholder="e.g., Upper Body" />
          </div>

          <div>
            <div style={styles.label}>Notes</div>
            <input
              style={styles.input}
              placeholder="e.g., Chest + Back focus"
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button>Save Workout</Button>
            <Button variant="ghost">+ Add Exercise</Button>
          </div>
          <div>
            <div style={styles.label}>Available Exercises</div>

            {loading ? (
              <p>Loading exercises...</p>
            ) : error ? (
              <p>{error}</p>
            ) : exercises.length === 0 ? (
              <p>No exercises found.</p>
            ) : (
              <div style={styles.exerciseList}>
                {exercises.map((exercise) => {
                  const isSelected = workoutExercises.some(
                    (workoutExercise) =>
                      workoutExercise.exerciseId === exercise.id,
                  );

                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => toggleExercise(exercise)}
                      style={{
                        ...styles.exerciseButton,
                        ...(isSelected ? styles.exerciseButtonSelected : {}),
                      }}
                    >
                      {exercise.name} {isSelected ? "✅" : ""}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <div style={styles.label}>Selected Exercises</div>

            {workoutExercises.length === 0 ? (
              <p>No exercises selected yet.</p>
            ) : (
              <div style={styles.selectedExercisesContainer}>
                {workoutExercises.map((workoutExercise) => (
                  <div
                    key={workoutExercise.exerciseId}
                    style={styles.selectedExerciseCard}
                  >
                    <strong>{workoutExercise.name}</strong>

                    {workoutExercise.sets.map((set, index) => (
                      <div key={index} style={styles.setRow}>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => {
                            handleSetChange(
                              workoutExercise.exerciseId,
                              index,
                              "reps",
                              e.target.value,
                            );
                          }}
                          style={styles.smallInput}
                        />

                        <input
                          type="number"
                          placeholder="weight"
                          value={set.weight}
                          onChange={(e) =>
                            handleSetChange(
                              workoutExercise.exerciseId,
                              index,
                              "weight",
                              e.target.value,
                            )
                          }
                          style={styles.smallInput}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => addSet(workoutExercise.exerciseId)}
                    >
                      + Add Set
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  week: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minMax(0, 1fr))",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 4,
  },

  dayCol: {
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 10,
    background: "rgba(245,247,251,0.7)",
    minWidth: 140,
  },

  dayLabel: { fontWeight: 900, marginBottom: 8 },

  workoutCard: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 10,
    background: "var(--card)",
    marginBottom: 8,
  },

  muted: { color: "var(--muted)", fontSize: 13, marginTop: 4 },

  editor: { display: "grid", gap: 12, maxWidth: 520 },

  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 900,
    color: "var(--muted)",
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "#fff",
    outline: "none",
  },

  exerciseList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  exerciseButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  exerciseButtonSelected: {
    background: "#eef6ff",
    border: "1px solid #9ec5fe",
  },

  selectedList: {
    margin: 0,
    paddingLeft: 18,
    display: "grid",
    gap: 8,
  },

  selectedExercisesContainer: {
    display: "grid",
    gap: 12,
  },

  selectedExerciseCard: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 12,
    background: "#fff",
    display: "grid",
    gap: 10,
  },

  setRow: {
    display: "flex",
    gap: 8,
  },

  smallInput: {
    width: 120,
    padding: 8,
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "#fff",
    outline: "none",
  },
};
