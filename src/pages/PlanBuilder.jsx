import { Button, Card } from "../components/layout/ui";
import { useState } from "react";
import WorkoutModal from "../components/layout/WorkoutModal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlanBuilder() {
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  return (
    <div style={{ maxWidth: 1100, display: "grid", gap: 14 }}>
      <Card
        title="Week Plan"
        action={
          <Button variant="ghost" onClick={() => setIsWorkoutModalOpen(true)}>
            + Add Workout
          </Button>
        }
      >
        <div style={styles.week}>
          {DAYS.map((day) => (
            <div key={day} style={styles.dayCol}>
              <div style={styles.dayLabel}>{day}</div>

              <div style={styles.workoutCard}>
                <div style={{ fontWeight: 600 }}>Upper</div>
                <div style={styles.muted}>6 exercises</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
      />
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
    maxHeight: "50vh",
  },

  dayCol: {
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
    minHeight: "15vh",
  },

  muted: { color: "var(--muted)", fontSize: 13, marginTop: 4 },
};
