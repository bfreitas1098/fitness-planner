import { useState } from "react";

export default function WorkoutModal({ isOpen, onClose }) {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modalContent}>
        <h2>Create Workout</h2>

        <div style={styles.field}>
          <label style={styles.label}>Workout Name</label>
          <input
            type="text"
            placeholder="e.g. Lower Body A"
            value={workoutName}
            style={styles.input}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Workout Date</label>
          <input
            type="date"
            value={workoutDate}
            style={styles.input}
            onChange={(e) => setWorkoutDate(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes</label>
          <input
            type="text"
            value={notes}
            placeholder="Optional notes"
            style={styles.input}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryButton}>Save Workout</button>
          <button onClick={onClose} style={styles.secondaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    minWidth: 400,
    display: "grid",
    gap: 14,
  },

  field: {
    display: "grid",
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },

  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },

  primaryButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};
