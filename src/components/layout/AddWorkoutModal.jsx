import { useEffect, useState } from "react";
import closeButton from "../../assets/close-btn.svg";
import caretDown from "../../assets/caret_down.svg";

function formatCreatedDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByCreatedDate(workouts) {
  const groups = [];

  workouts.forEach((workout) => {
    const label = formatCreatedDate(workout.createdAt);
    const group = groups.find((existing) => existing.label === label);

    if (group) {
      group.workouts.push(workout);
    } else {
      groups.push({ label, workouts: [workout] });
    }
  });

  return groups;
}

export default function AddWorkoutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return <AddWorkoutModalContent onClose={onClose} />;
}

function AddWorkoutModalContent({ onClose }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState({});

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch("http://localhost:3001/workouts");

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        const newestFirst = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setWorkouts(newestFirst);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError("Could not load workouts");
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  async function handleSelectWorkout(workoutId) {
    setSelectedWorkoutId(workoutId);

    if (workoutDetails[workoutId]) return;

    try {
      const response = await fetch(
        `http://localhost:3001/workouts/${workoutId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workout details");
      }

      const data = await response.json();
      const exercises = [...data.workoutExercises]
        .sort((a, b) => a.id - b.id)
        .map((workoutExercise) => ({
          id: workoutExercise.id,
          name: workoutExercise.exercise.name,
          setCount: workoutExercise.sets.length,
        }));

      setWorkoutDetails((current) => ({ ...current, [workoutId]: exercises }));
    } catch (err) {
      console.error("Error fetching workout details:", err);
      setWorkoutDetails((current) => ({ ...current, [workoutId]: null }));
    }
  }

  function renderExercises(workoutId) {
    const exercises = workoutDetails[workoutId];

    if (exercises === undefined) return <p style={styles.note}>Loading...</p>;
    if (exercises === null) {
      return <p style={styles.note}>Could not load exercises</p>;
    }
    if (exercises.length === 0) {
      return <p style={styles.note}>No exercises in this workout.</p>;
    }

    return (
      <ul style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <li key={exercise.id} style={styles.exerciseItem}>
            <span>{exercise.name}</span>
            <span style={styles.setCount}>
              {exercise.setCount} {exercise.setCount === 1 ? "set" : "sets"}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      style={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div style={styles.modalContent} role="dialog" aria-modal="true">
        <div style={styles.header}>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={styles.closeButton}
          >
            <img src={closeButton} alt="" aria-hidden="true" />
          </button>
        </div>

        <div style={styles.listArea}>
          {loading ? (
            <p style={styles.note}>Loading workouts...</p>
          ) : error ? (
            <p style={styles.note}>{error}</p>
          ) : workouts.length === 0 ? (
            <p style={styles.note}>No saved workouts yet.</p>
          ) : (
            groupByCreatedDate(workouts).map((group) => (
              <section key={group.label} style={styles.group}>
                <h3 style={styles.groupTitle}>{group.label}</h3>

                {group.workouts.map((workout) => {
                  const isSelected = selectedWorkoutId === workout.id;

                  return (
                    <div key={workout.id} style={styles.workoutItem}>
                      <button
                        type="button"
                        aria-expanded={isSelected}
                        className="button-hover"
                        onClick={() => handleSelectWorkout(workout.id)}
                        style={{
                          ...styles.workoutButton,
                          ...(isSelected ? styles.workoutButtonSelected : {}),
                        }}
                      >
                        <span style={styles.workoutName}>{workout.name}</span>
                        <span style={styles.exerciseCount}>
                          {workout._count?.workoutExercises ?? 0}{" "}
                          {workout._count?.workoutExercises === 1
                            ? "exercise"
                            : "exercises"}
                        </span>
                        <span style={styles.caretWrapper}>
                          <img
                            src={caretDown}
                            alt=""
                            aria-hidden="true"
                            width="24"
                            height="24"
                          />
                        </span>
                      </button>

                      {isSelected && (
                        <div style={styles.exerciseBox}>
                          {renderExercises(workout.id)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            ))
          )}
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            className="button-hover"
            style={styles.primaryButton}
            onClick={onClose}
          >
            Select Workout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
    padding: 16,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: "16px 24px",
    borderRadius: "var(--radius)",
    width: "min(520px, 100%)",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "var(--shadow)",
  },

  header: {
    display: "flex",
    justifyContent: "flex-end",
  },

  closeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: 6,
  },

  listArea: {
    display: "grid",
    gap: 16,
    overflowY: "auto",
    minHeight: 0,
  },

  group: {
    display: "grid",
    gap: 8,
  },

  groupTitle: {
    margin: 0,
    fontSize: 14,
    color: "var(--muted)",
  },

  workoutItem: {
    display: "grid",
    gap: 8,
  },

  workoutButton: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    backgroundColor: "#fff",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
  },

  workoutButtonSelected: {
    backgroundColor: "var(--primary)",
    borderColor: "var(--primary)",
    color: "#fff",
  },

  workoutName: {
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  exerciseCount: {
    textAlign: "center",
    fontSize: 14,
  },

  caretWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },

  exerciseBox: {
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
  },

  exerciseList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  exerciseItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },

  setCount: {
    color: "var(--muted)",
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  note: {
    margin: 0,
    fontSize: 14,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },

  primaryButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
