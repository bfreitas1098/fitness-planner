import { Button, Card } from "../components/layout/ui";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlanBuilder() {
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
};
