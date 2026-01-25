import { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Sidebar from "./components/layout/Sidebar";
import { Button } from "./components/layout/ui";
import Dashboard from "./pages/Dashboard";
import PlanBuilder from "./pages/PlanBuilder";

export default function App() {
  const [active, setActive] = useState("dashboard");

  const header = (
    <div style={styles.headerRow}>
      <div>
        <div style={styles.title}>
          {active === "dashboard" ? "Dashboard" : "Plan Builder"}
        </div>
        <div style={styles.sub}>Build your week and track progress</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="ghost">Settings</Button>
        <Button>Quick Add</Button>
      </div>
    </div>
  );

  return (
    <AppLayout
      sidebar={<Sidebar active={active} onChange={setActive} />}
      header={header}
    >
      {active === "dashboard" ? <Dashboard /> : <PlanBuilder />}
    </AppLayout>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  title: { fontSize: 16, fontWeight: 900 },

  sub: { fontSize: 13, color: "var(--muted)", marginTop: 4 },
};
