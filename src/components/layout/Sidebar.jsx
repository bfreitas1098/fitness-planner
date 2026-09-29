export default function Sidebar({ active, onChange }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "plan", label: "Plan Builder" },
    { key: "calendar", label: "Calendar" },
    { key: "logs", label: "Workout Logs" },
  ];

  return (
    <div>
      <div style={styles.brand}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Training Planner</div>
        <div style={{ fontSize: 12, color: "var(--bg)" }}>
          Fitness • Planning • Progress
        </div>
      </div>

      <div style={styles.nav}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  brand: {
    padding: 16,
    borderBottom: "1px solid var(--border)",
  },

  nav: {
    padding: 12,
    display: "grid",
    gap: 8,
  },

  navItem: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--primary)",
    cursor: "pointer",
    fontWeight: 700,
  },

  navItemActive: {
    border: "1px solid var(--border)",
    background: "rgba(233, 235, 248, 0.7)",
  },
};
