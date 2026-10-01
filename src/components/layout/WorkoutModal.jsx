import { useState, useEffect } from "react";
import { Button } from "./ui";
import ExerciseModal from "./ExerciseModal";
import caretDown from "../../assets/caret_down.svg";
import caretRight from "../../assets/caret_right.svg";
import trashButton from "../../assets/trash-btn.svg";

const exerciseCategories = [
  { category: "UPPER_BODY", label: "Upper Body" },
  { category: "LOWER_BODY", label: "Lower Body" },
  { category: "CORE", label: "Core" },
];

export default function WorkoutModal({
  isOpen,
  onClose,
  onWorkoutSaved,
  inline = false,
}) {
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [notes, setNotes] = useState("");
  const [areExercisesExpanded, setAreExercisesExpanded] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  const exerciseGroups = [
    ...exerciseCategories.map(({ category, label }) => ({
      label,
      exercises: exercises.filter((exercise) => exercise.category === category),
    })),
    {
      label: "Other",
      exercises: exercises.filter((exercise) => !exercise.category),
    },
  ].filter((group) => group.exercises.length > 0);

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
        sets: [
          ...workoutExercise.sets,
          {
            reps: workoutExercise.sets[0].reps,
            weight: workoutExercise.sets[0].weight,
          },
        ],
      };
    });

    setWorkoutExercises(updatedWorkoutExercises);
  }

  function removeSet(exerciseId, setIndex) {
    const updatedWorkoutExercises = workoutExercises.map((workoutExercise) => {
      if (workoutExercise.exerciseId !== exerciseId || setIndex === 0) {
        return workoutExercise;
      }

      return {
        ...workoutExercise,
        sets: workoutExercise.sets.filter((_, index) => index !== setIndex),
      };
    });

    setWorkoutExercises(updatedWorkoutExercises);
  }

  async function handleSaveWorkout() {
    if (!workoutName.trim() || !workoutDate) {
      alert("Workout name and date are required");
      return;
    }

    if (workoutExercises.length === 0) {
      alert(
        "You have not selected any exercises. You can still save this workout.",
      );
      return;
    }

    const incompleteSet = workoutExercises
      .flatMap((exercise) =>
        exercise.sets.map((set, index) => ({
          exerciseName: exercise.name,
          setNumber: index + 1,
          reps: Number(set.reps),
          repsInput: set.reps,
        })),
      )
      .find(
        (set) =>
          set.repsInput.trim() === "" ||
          !Number.isInteger(set.reps) ||
          set.reps < 0,
      );

    if (incompleteSet) {
      alert(
        `Enter a valid rep amount for set ${incompleteSet.setNumber} of ${incompleteSet.exerciseName}.`,
      );
      return;
    }

    const payload = {
      name: workoutName.trim(),
      date: workoutDate,
      exercises: workoutExercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set) => ({
          reps: Number(set.reps),
          weight: set.weight === "" ? undefined : Number(set.weight),
        })),
      })),
    };

    try {
      const response = await fetch("http://localhost:3001/workouts/full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save workout");
      }

      const data = await response.json();
      console.log("Workout saved:", data);
      onWorkoutSaved?.(data);

      // Reset form
      setWorkoutName("");
      setWorkoutDate("");
      setNotes("");
      setWorkoutExercises([]);

      if (!inline) onClose?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the workout");
    }
  }

  if (!isOpen) return null;

  return (
    <div style={inline ? styles.inlineContainer : styles.backdrop}>
      <div style={inline ? styles.inlineContent : styles.modalContent}>
        {!inline && <h2>Create Workout</h2>}

        <div style={styles.field}>
          <label style={styles.label}>Workout Name</label>
          <input
            type="text"
            placeholder="e.g. Lower Body A"
            required
            value={workoutName}
            style={styles.input}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Workout Date</label>
          <input
            type="date"
            required
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
          <button
            type="button"
            style={styles.exerciseToggle}
            aria-expanded={areExercisesExpanded}
            aria-controls="available-exercises-content"
            onClick={() => setAreExercisesExpanded((expanded) => !expanded)}
          >
            <span>Available Exercises</span>
            <img
              src={areExercisesExpanded ? caretDown : caretRight}
              alt=""
              aria-hidden="true"
              width="24"
              height="24"
            />
          </button>

          {areExercisesExpanded && (
            <div
              id="available-exercises-content"
              style={styles.exerciseContent}
            >
              {loading ? (
                <p>Loading exercises...</p>
              ) : error ? (
                <p>{error}</p>
              ) : exercises.length === 0 ? (
                <p>No exercises found.</p>
              ) : (
                <div style={styles.exerciseGroups}>
                  {exerciseGroups.map((group) => (
                    <section key={group.label} style={styles.exerciseGroup}>
                      <h3 style={styles.exerciseGroupTitle}>{group.label}</h3>
                      <div style={styles.exerciseList}>
                        {group.exercises.map((exercise) => {
                          const isSelected = workoutExercises.some(
                            (workoutExercise) =>
                              workoutExercise.exerciseId === exercise.id,
                          );
                          const exerciseOrder = workoutExercises.findIndex(
                            (workoutExercise) =>
                              workoutExercise.exerciseId === exercise.id,
                          );

                          return (
                            <button
                              key={exercise.id}
                              type="button"
                              className={inline ? "button-hover" : undefined}
                              onClick={() => toggleExercise(exercise)}
                              style={{
                                ...styles.exerciseButton,
                                ...(isSelected
                                  ? styles.exerciseButtonSelected
                                  : {}),
                              }}
                            >
                              {isSelected ? `${exerciseOrder + 1}. ` : ""}
                              {exercise.name}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                className={inline ? "button-hover ghost-button" : undefined}
                onClick={() => setIsExerciseModalOpen(true)}
              >
                Create Exercise
              </Button>
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
                        min="0"
                        value={set.reps}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSetChange(
                            workoutExercise.exerciseId,
                            index,
                            "reps",
                            value !== "" && Number(value) < 0 ? "0" : value,
                          );
                        }}
                        style={styles.smallInput}
                      />

                      <input
                        type="number"
                        placeholder="weight (lb)"
                        min="0"
                        value={set.weight}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSetChange(
                            workoutExercise.exerciseId,
                            index,
                            "weight",
                            value !== "" && Number(value) < 0 ? "0" : value,
                          );
                        }}
                        style={styles.smallInput}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          aria-label={`Remove set ${index + 1} from ${workoutExercise.name}`}
                          onClick={() =>
                            removeSet(workoutExercise.exerciseId, index)
                          }
                          style={styles.removeSetButton}
                        >
                          <img src={trashButton} alt="" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    className={inline ? "button-hover ghost-button" : undefined}
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
          <button style={styles.primaryButton} onClick={handleSaveWorkout}>
            Save Workout
          </button>
          {!inline && (
            <button onClick={onClose} style={styles.secondaryButton}>
              Close
            </button>
          )}
        </div>
      </div>

      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onExerciseSaved={(exercise) => {
          setExercises((currentExercises) => [
            ...currentExercises.filter(
              (currentExercise) => currentExercise.id !== exercise.id,
            ),
            exercise,
          ]);
        }}
      />
    </div>
  );
}

const styles = {
  inlineContainer: {
    width: "100%",
  },
  inlineContent: {
    display: "grid",
    gap: 14,
  },
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
    width: "75vw",
    minWidth: 0,
    maxHeight: "90vh",
    overflowY: "auto",
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

  exerciseToggle: {
    width: "100%",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    font: "inherit",
    fontSize: 18,
    fontWeight: 700,
    textAlign: "left",
  },

  exerciseContent: {
    display: "grid",
    gap: 14,
    marginTop: 12,
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

  exerciseGroups: {
    display: "grid",
    gap: 14,
  },

  exerciseGroup: {
    display: "grid",
    gap: 8,
  },

  exerciseGroupTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
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
    alignItems: "center",
    gap: 8,
  },

  removeSetButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
    transform: "translateX(-4px)",
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
