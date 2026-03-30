import { Card } from "../components/layout/ui";

export default function Dashboard() {
  return (
    <div style={styles.grid}>
      <Card title="This Week">
        <div style={styles.kpis}>
          <Kpi label="Workouts Planned" value="5" />
          <Kpi label="Completed" value="2" />
          <Kpi label="Streak" value="3 days" />
          <Kpi label="Minutes" value="110" />
        </div>
      </Card>

      <Card title="Next Up">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Upper Body</div>
        <div style={{ color: "var(--muted)" }}>
          Monday • 6 exercies • Estimated 55 min
        </div>
      </Card>

      <Card title="Progress">
        <div style={{ color: "var(--muted)" }}>
          (Chart placeholder) Weekly volume will go here.
        </div>
        <div style={styles.chartPlaceholder} />
      </Card>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={styles.kpi}>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const styles = {
  grid: { display: "grid", gap: 14, maxWidth: 1000 },

  kpis: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(4, minMax(0, 1fr))",
  },

  kpi: {
    padding: 12,
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "rgba(245,247,251,0.7)",
  },

  chartPlaceholder: {
    marginTop: 12,
    height: 180,
    borderRadius: 14,
    border: "1px dashed #cdd3e6",
    background: "rgba(245,247,251,0.7)",
  },
};
