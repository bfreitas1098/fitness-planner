import { useState, useEffect } from "react";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch("http://localhost:3001/exercises");

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Could not load exercises");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  if (loading) {
    return <p>Loading exercises...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Exercises</h2>

      {exercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>{exercise.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExerciseList;
