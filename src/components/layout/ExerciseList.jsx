// function ExerciseList() {
//   if (loading) {
//     return <p>Loading exercises...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h2>Exercises</h2>

//       {exercises.length === 0 ? (
//         <p>No exercises found.</p>
//       ) : (
//         <ul>
//           {exercises.map((exercise) => {
//             const isSelected = workoutExercises.some(
//               (workoutExercise) => workoutExercise.exerciseId === exercise.id,
//             );

//             return (
//               <li key={exercise.id}>
//                 <button onClick={() => toggleExercise(exercise)}>
//                   {exercise.name} {isSelected ? "✅" : ""}
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       <h3>Workout Exercises</h3>
//       {workoutExercises.length === 0 ? (
//         <p>No exercises selected yet.</p>
//       ) : (
//         <ul>
//           {workoutExercises.map((workoutExercise) => (
//             <li key={workoutExercise.exerciseId}>
//               <strong>{workoutExercise.name}</strong>
//               <div>Sets: {workoutExercise.sets.length}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ExerciseList;
