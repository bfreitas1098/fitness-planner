import { Button, Card } from "../components/layout/ui";
import WorkoutModal from "../components/layout/WorkoutModal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCurrentWeekRange() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export default function PlanBuilder() {
  return (
    <div style={{ maxWidth: 1100, display: "grid", gap: 20 }}>
      <Card title="Week Plan">
        <div style={styles.weekRange}>{getCurrentWeekRange()}</div>
        <div style={styles.week}>
          {DAYS.map((day) => (
            <div key={day} style={styles.dayCol}>
              <div style={styles.dayLabel}>{day}</div>

              <div style={styles.workoutCard}>
                <div style={{ fontWeight: 600 }}>Upper</div>
                <div style={styles.muted}>6 exercises</div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="button-hover ghost-button"
                style={{ fontSize: "14px" }}
              >
                + Add Workout
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Create Workout">
        <WorkoutModal isOpen inline />
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
