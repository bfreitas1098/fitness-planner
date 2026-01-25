export default function AppLayout({ sidebar, header, children }) {
  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>{sidebar}</aside>
      <div style={styles.main}>
        <header style={styles.header}>{header}</header>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    background: "var(--card)",
    borderRight: "1px solid var(--border)",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 20px",
  },
  header: {
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
    padding: "16px 20px",
  },
  content: {
    padding: 20,
    minWidth: 0,
  },
};
