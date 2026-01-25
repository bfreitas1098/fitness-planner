export function Button({ variant = "primary", style, ...props }) {
  const base = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    cursor: "pointer",
    fontWeight: 700,
  };

  const primary = {
    border: "1px solid var(--primary)",
    background: "var(--primary)",
    color: "#fff",
  };

  const ghost = {
    background: "transparent",
  };

  const s = {
    ...base,
    ...(variant === "primary" ? primary : {}),
    ...(variant === "ghost" ? ghost : {}),
    ...style,
  };

  return <button style={s} {...props} />;
}

export function Card({ title, action, children }) {
  return (
    <section style={styles.card}>
      {(title || action) && (
        <div style={styles.cardTop}>
          <div style={{ fontWeight: 800 }}>{title}</div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const styles = {
  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 16,
    boxShadow: "var(--shadow)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
};
