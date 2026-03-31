import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import 'jspdf-autotable';

export const generateFitnessReport = (user, workouts, nutrition, progress) => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Fitness Progress Report", 14, 15);

  // User Info
  doc.setFontSize(12);
  doc.text(`User: ${user.name}`, 14, 25);
  doc.text(`Email: ${user.email}`, 14, 32);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 39);

  // Weight Progress Summary
  doc.setFontSize(14);
  doc.text("Weight Progress", 14, 50);

  doc.setFontSize(12);

  if(progress.length > 0){
    const latest = progress[progress.length - 1];
    const first = progress[0];

    doc.text(`Starting Weight: ${first.weight} kg`, 14, 58);
    doc.text(`Current Weight: ${latest.weight} kg`, 14, 65);
    doc.text(`Total Change: ${latest.weight - first.weight} kg`, 14, 72);
  } else {
    doc.text("No progress data available", 14, 58);
  }

  // Calories Summary
  doc.setFontSize(14);
  doc.text("Nutrition Summary", 14, 90);

  let totalCalories = 0;

  nutrition.forEach(n => {
    totalCalories += n.calories;
  });

  doc.setFontSize(12);
  doc.text(`Total Calories Logged: ${totalCalories}`, 14, 98);
  doc.text(`Entries: ${nutrition.length}`, 14, 105);

  // Workout Table
  doc.setFontSize(14);
  doc.text("Workout History", 14, 120);

  const workoutColumns = [
    "Exercise",
    "Category",
    "Sets",
    "Reps",
    "Weight"
  ];

  const workoutRows = workouts.map(w => [
    w.exerciseName,
    w.category,
    w.sets,
    w.reps,
    w.weight
  ]);

  autoTable(doc,{
    head:[workoutColumns],
    body:workoutRows,
    startY:125
  });

  // Save PDF
  doc.save("fitness-progress-report.pdf");
};