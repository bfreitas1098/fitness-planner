import { useState, useEffect } from "react";
import { Button } from "./ui";

export default function WorkoutModal({ isOpen, onClose }) {
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [notes, setNotes] = useState("");

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

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modalContent}>
        <h2>Create Workout</h2>

        <div style={styles.field}>
          <label style={styles.label}>Workout Name</label>
          <input
            type="text"
            placeholder="e.g. Lower Body A"
            value={workoutName}
            style={styles.input}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Workout Date</label>
          <input
            type="date"
            value={workoutDate}
            style={styles.input}
            onChange={(e) => setWorkoutDate(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes</label>
          <input
            type="text"
            value={notes}
            placeholder="Optional notes"
            style={styles.input}
            onChange={(e) => setNotes(e.target.value)}
          />
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

        <div style={styles.actions}>
          <button style={styles.primaryButton}>Save Workout</button>
          <button onClick={onClose} style={styles.secondaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    minWidth: 400,
    display: "grid",
    gap: 14,
  },

  field: {
    display: "grid",
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },

  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },

  primaryButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
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
