export default function Modal() {
  return (
    <div style={styles.backdrop}>
      <div style={styles.modalContent}>
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
        <button>Close</button>
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
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
  },
};
