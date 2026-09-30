import { useEffect, useState } from "react";
import { Button, Card } from "../components/layout/ui";
import WorkoutModal from "../components/layout/WorkoutModal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  function handleWorkoutSaved(savedWorkout) {
    setWorkouts((currentWorkouts) => [
      savedWorkout,
      ...currentWorkouts.filter((workout) => workout.id !== savedWorkout.id),
    ]);
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

                  return (
                    <div key={workout.id} style={styles.workoutCard}>
                      <div style={{ fontWeight: 600 }}>{workout.name}</div>
                      <div style={styles.muted}>
                        {exerciseCount}{" "}
                        {exerciseCount === 1 ? "exercise" : "exercises"}
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="ghost"
                  className="button-hover ghost-button"
                  style={{ fontSize: "14px" }}
                >
                  + Add Workout
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Create Workout">
        <WorkoutModal isOpen inline onWorkoutSaved={handleWorkoutSaved} />
      </Card>
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
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 10,
    background: "var(--card)",
    marginBottom: 8,
    maxHeight: "15vh",
  },

  muted: { color: "var(--muted)", fontSize: 13, marginTop: 4 },
};
