import { useState } from "react";
import closeButton from "../../assets/close-btn.svg";

const categoryValues = {
  "Upper Body": "UPPER_BODY",
  "Lower Body": "LOWER_BODY",
  Core: "CORE",
};

export default function ExerciseModal({ isOpen, onClose, onExerciseSaved }) {
  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleClose() {
    setExerciseName("");
    setCategory("");
    setNotes("");
    onClose?.();
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:3001/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: exerciseName.trim(),
          category: categoryValues[category],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save exercise");
      }

      onExerciseSaved?.(data);
      handleClose();
    } catch (err) {
      console.error("Error saving exercise:", err);
      setError(err.message || "Could not save exercise. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      style={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <form
        style={styles.modalContent}
        role="dialog"
        aria-modal="true"
        onSubmit={handleSave}
      >
        <div style={styles.header}>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            style={styles.closeButton}
          >
            <img src={closeButton} alt="" aria-hidden="true" />
          </button>
        </div>

        <div style={styles.field}>
          <label htmlFor="exercise-name" style={styles.label}>
            Exercise Name <span style={styles.requiredStar}>*</span>
          </label>
          <input
            id="exercise-name"
            type="text"
            placeholder="e.g. Incline Bench Press"
            value={exerciseName}
            required
            disabled={isSaving}
            style={styles.input}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <span style={styles.label}>
            Select a muscle group <span style={styles.requiredStar}>*</span>
          </span>
          <div style={styles.radioGroup}>
            {[
              { value: "Upper Body", label: "Upper Body" },
              { value: "Lower Body", label: "Lower Body" },
              { value: "Core", label: "Core" },
            ].map((option) => (
              <label key={option.value} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="exerciseCategory"
                  value={option.value}
                  checked={category === option.value}
                  required
                  disabled={isSaving}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.radioInput}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label htmlFor="exercise-notes" style={styles.label}>
            Notes
          </label>
          <textarea
            id="exercise-notes"
            placeholder="Optional notes"
            value={notes}
            rows={3}
            disabled={isSaving}
            style={styles.textarea}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" style={styles.error}>
            {error}
          </p>
        )}

        <div style={styles.actions}>
          <button
            type="submit"
            style={styles.primaryButton}
            className="button-hover"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Exercise"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
    padding: 16,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: "16px 24px",
    borderRadius: 12,
    width: "min(460px, 100%)",
    display: "grid",
    gap: 16,
    boxShadow: "var(--shadow)",
    position: "relative",
  },

  header: {
    display: "flex",
    justifyContent: "flex-end",
  },

  closeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: 6,
  },

  field: {
    display: "grid",
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: 700,
  },

  requiredStar: {
    color: "#e11d48",
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    font: "inherit",
    boxSizing: "border-box",
  },

  radioGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    paddingTop: 2,
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    cursor: "pointer",
  },

  radioInput: {
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    font: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 4,
  },

  primaryButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
    margin: 0,
  },
};
