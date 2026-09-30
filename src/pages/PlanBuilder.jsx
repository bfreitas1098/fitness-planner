import { useEffect, useRef, useState } from "react";
import { Button, Card } from "../components/layout/ui";
import WorkoutModal from "../components/layout/WorkoutModal";
import closeButton from "../assets/close-btn.svg";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LONG_PRESS_DELAY = 500;

function getCurrentWeekDates() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay());

  return DAYS.map((_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCurrentWeekRange(weekDates) {
  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export default function PlanBuilder() {
  const [workouts, setWorkouts] = useState([]);
  const [workoutsError, setWorkoutsError] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutDetailsLoading, setIsWorkoutDetailsLoading] = useState(false);
  const [workoutDetailsError, setWorkoutDetailsError] = useState("");
  const [workoutMenu, setWorkoutMenu] = useState(null);
  const [workoutsActionError, setWorkoutsActionError] = useState("");
  const workoutDetailsRequest = useRef(0);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const workoutMenuRef = useRef(null);
  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    let isActive = true;

    async function fetchWorkouts() {
      try {
        const response = await fetch("http://localhost:3001/workouts");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        if (isActive) {
          setWorkouts(data);
          setWorkoutsError("");
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
        if (isActive) {
          setWorkoutsError("Could not load workouts");
        }
      }
    }

    fetchWorkouts();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!workoutMenu) return undefined;

    function dismissMenu(event) {
      if (!workoutMenuRef.current?.contains(event.target)) {
        setWorkoutMenu(null);
      }
    }

    document.addEventListener("pointerdown", dismissMenu);
    return () => document.removeEventListener("pointerdown", dismissMenu);
  }, [workoutMenu]);

  function handleWorkoutSaved(savedWorkout) {
    setWorkouts((currentWorkouts) => [
      savedWorkout,
      ...currentWorkouts.filter((workout) => workout.id !== savedWorkout.id),
    ]);
  }

  async function viewWorkout(workoutId) {
    const requestId = ++workoutDetailsRequest.current;
    setSelectedWorkout(null);
    setWorkoutDetailsError("");
    setIsWorkoutDetailsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/workouts/${workoutId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workout details");
      }

      const workout = await response.json();
      if (requestId === workoutDetailsRequest.current) {
        setSelectedWorkout(workout);
      }
    } catch (error) {
      console.error("Error fetching workout details:", error);
      if (requestId === workoutDetailsRequest.current) {
        setWorkoutDetailsError("Could not load workout details");
      }
    } finally {
      if (requestId === workoutDetailsRequest.current) {
        setIsWorkoutDetailsLoading(false);
      }
    }
  }

  function closeWorkoutDetails() {
    workoutDetailsRequest.current += 1;
    setSelectedWorkout(null);
    setIsWorkoutDetailsLoading(false);
    setWorkoutDetailsError("");
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function startLongPress(workoutId) {
    cancelLongPress();
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setWorkoutMenu({ workoutId });
    }, LONG_PRESS_DELAY);
  }

  async function deleteWorkout(workoutId) {
    setWorkoutsActionError("");
    try {
      const response = await fetch(
        `http://localhost:3001/workouts/${workoutId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter((workout) => workout.id !== workoutId),
      );
      setWorkoutMenu(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      setWorkoutsActionError("Could not delete workout");
    }
  }

  return (
    <div style={{ maxWidth: 1100, display: "grid", gap: 20 }}>
      <Card title="Week Plan">
        <div style={styles.weekRange}>{getCurrentWeekRange(weekDates)}</div>
        {workoutsError && <p role="alert">{workoutsError}</p>}
        <div style={styles.week}>
          {DAYS.map((day, index) => {
            const dayDateKey = getDateKey(weekDates[index]);
            const dayWorkouts = workouts.filter(
              (workout) => String(workout.date).slice(0, 10) === dayDateKey,
            );

            return (
              <div key={day} style={styles.dayCol}>
                <div style={styles.dayLabel}>{day}</div>

                {dayWorkouts.map((workout) => {
                  const exerciseCount =
                    workout._count?.workoutExercises ??
                    workout.workoutExercises?.length ??
                    0;
                  const isMenuOpen = workoutMenu?.workoutId === workout.id;

                  return (
                    <div key={workout.id} style={styles.workoutCardWrapper}>
                      <button
                        type="button"
                        className="button-hover"
                        style={styles.workoutCard}
                        onPointerDown={() => startLongPress(workout.id)}
                        onPointerUp={cancelLongPress}
                        onPointerLeave={cancelLongPress}
                        onPointerCancel={cancelLongPress}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          didLongPress.current = true;
                          setWorkoutMenu({ workoutId: workout.id });
                        }}
                        onClick={() => {
                          if (didLongPress.current) {
                            didLongPress.current = false;
                            return;
                          }
                          viewWorkout(workout.id);
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{workout.name}</div>
                        <div style={styles.muted}>
                          {exerciseCount}{" "}
                          {exerciseCount === 1 ? "exercise" : "exercises"}
                        </div>
                      </button>

                      {isMenuOpen && (
                        <div
                          ref={workoutMenuRef}
                          role="menu"
                          aria-label={`Actions for ${workout.name}`}
                          style={styles.workoutMenu}
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => deleteWorkout(workout.id)}
                            style={styles.menuButton}
                          >
                            Delete workout
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="ghost"
                  className="button-hover ghost-button"
                  style={{ fontSize: "14px", padding: "8px" }}
                >
                  + Add Workout
                </Button>
              </div>
            );
          })}
        </div>
        {workoutsActionError && <p role="alert">{workoutsActionError}</p>}
      </Card>

      <Card title="Create Workout">
        <WorkoutModal isOpen inline onWorkoutSaved={handleWorkoutSaved} />
      </Card>

      {(selectedWorkout || isWorkoutDetailsLoading || workoutDetailsError) && (
        <div
          style={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeWorkoutDetails();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-details-title"
            style={styles.detailsModal}
          >
            <div style={styles.detailsHeader}>
              <h2 id="workout-details-title" style={styles.detailsTitle}>
                {selectedWorkout?.name ?? "Workout"}
              </h2>
              <button
                type="button"
                aria-label="Close workout details"
                onClick={closeWorkoutDetails}
                style={styles.closeButton}
              >
                <img src={closeButton} alt="" aria-hidden="true" />
              </button>
            </div>

            {isWorkoutDetailsLoading ? (
              <p>Loading workout...</p>
            ) : workoutDetailsError ? (
              <p role="alert">{workoutDetailsError}</p>
            ) : (
              <>
                <h3 style={styles.exercisesTitle}>Exercises</h3>
                {selectedWorkout.workoutExercises.length === 0 ? (
                  <p>No exercises added.</p>
                ) : (
                  <div style={styles.detailsExercises}>
                    {selectedWorkout.workoutExercises.map((workoutExercise) => (
                      <section
                        key={workoutExercise.id}
                        style={styles.detailsExercise}
                      >
                        <h4 style={styles.exerciseName}>
                          {workoutExercise.exercise.name}
                        </h4>
                        <ol style={styles.setList}>
                          {[...workoutExercise.sets]
                            .sort((a, b) => a.setNumber - b.setNumber)
                            .map((set) => (
                              <li key={set.id} style={styles.setItem}>
                                <span>Set {set.setNumber}</span>
                                <span>{set.reps} reps</span>
                                <span>
                                  {set.weight == null
                                    ? "Weight not recorded"
                                    : `${set.weight} lb`}
                                </span>
                              </li>
                            ))}
                        </ol>
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

const styles = {
  weekRange: {
    color: "var(--muted)",
    fontSize: 14,
    marginBottom: 14,
    marginTop: -9,
  },

  week: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minMax(0, 1fr))",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 4,
    maxHeight: "50vh",
  },

  dayCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 10,
    background: "rgba(245,247,251,0.7)",
    minWidth: 140,
    maxHeight: "50vh",
  },

  dayLabel: { fontWeight: 900, marginBottom: 12 },

  workoutCard: {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 10,
    background: "var(--card)",
    marginBottom: 8,
    maxHeight: "15vh",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
    transition: "box-shadow 120ms ease-in-out",
  },

  workoutCardWrapper: {
    position: "relative",
  },

  workoutMenu: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: "calc(100% + 6px)",
    minWidth: 140,
    display: "grid",
    gap: 4,
    padding: 6,
    border: "1px solid var(--border)",
    borderRadius: 10,
    background: "var(--bg)",
    boxShadow: "var(--shadow)",
  },

  menuButton: {
    padding: "8px 10px",
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },

  detailsModal: {
    width: "min(600px, 100%)",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: 24,
    border: "1px solid var(--border)",
    borderRadius: 16,
    background: "var(--card)",
    boxShadow: "var(--shadow)",
  },

  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },

  detailsTitle: {
    margin: 0,
    fontSize: 22,
  },

  closeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  exercisesTitle: {
    margin: "0 0 12px",
    fontSize: 18,
  },

  detailsExercises: {
    display: "grid",
    gap: 12,
  },

  detailsExercise: {
    padding: 12,
    border: "1px solid var(--border)",
    borderRadius: 12,
    background: "var(--bg)",
  },

  exerciseName: {
    margin: "0 0 8px",
  },

  setList: {
    margin: 0,
    paddingLeft: 24,
  },

  setItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    padding: "4px 0",
  },

  muted: { color: "var(--muted)", fontSize: 13, marginTop: 4 },
};
