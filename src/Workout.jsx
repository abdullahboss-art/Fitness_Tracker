import { useEffect, useState } from "react";
import axios from "axios";

import './Workout.css';

function Workouts() {
 
  const [workouts, setWorkouts] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("strength");
  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getWorkouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/workouts/list?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(res.data.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        alert("Please login first");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const searchWorkouts = async () => {
    if (!searchTerm.trim()) {
      getWorkouts();
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/workouts/search?q=${searchTerm}&date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exerciseName || !sets || !reps) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const workoutData = {
        name: exerciseName,
        category: category,
        difficulty: difficulty,
        duration: parseInt(duration) || 0,
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        isPublic: false,
        date: selectedDate,
        exercises: [{
          exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight) || 0,
          notes: notes
        }]
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/workouts/update/${editingId}`, workoutData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        alert("Workout updated successfully!");
      } else {
        await axios.post("http://localhost:3000/workouts/add", workoutData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        alert("Workout added successfully!");
      }
      getWorkouts();
      resetForm();
    } catch (err) {
      console.log(err);
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setCategory("strength");
    setDifficulty("beginner");
    setDuration("");
    setNotes("");
    setTags("");
    setEditingId(null);
  };

  const handleEdit = (workout) => {
    setExerciseName(workout.name);
    setCategory(workout.category);
    setDifficulty(workout.difficulty);
    setDuration(workout.duration);
    setTags(workout.tags?.join(", ") || "");
    setEditingId(workout._id);
    if (workout.exercises?.length > 0) {
      setExerciseName(workout.exercises[0].exerciseName);
      setSets(workout.exercises[0].sets);
      setReps(workout.exercises[0].reps);
      setWeight(workout.exercises[0].weight);
      setNotes(workout.exercises[0].notes || "");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/workouts/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getWorkouts();
      alert("Workout deleted successfully!");
    } catch (err) {
      console.log(err);
      alert("Error deleting workout");
    }
  };

 // Line number around 180-185
// const goToWorkoutDetails = () => {
//   navigate("/dashbored/WorkoutsPage");  // Ye sahi hai
// };
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((acc, w) => acc + (w.exercises?.length || 0), 0);
  const totalWeight = workouts.reduce((acc, w) => {
    return acc + (w.exercises?.reduce((sum, e) => sum + (e.weight * e.sets * e.reps), 0) || 0);
  }, 0);

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>🏋️ Workout Tracker Pro</h1>
        <p className="header-subtitle">Track your fitness journey like a pro</p>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalWorkouts}</span>
            <span className="stat-label">Total Workouts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalExercises}</span>
            <span className="stat-label">Total Exercises</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalWeight} kg</span>
            <span className="stat-label">Total Volume</span>
          </div>
        </div>
      </div>

      <div className="search-filter-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="search-box" style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchWorkouts()}
            style={{ flex: 1, padding: '8px', borderRadius: '5px' }}
          />
          <button onClick={searchWorkouts} className="btn" style={{ padding: '8px 15px' }}>Search</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', background: '#1a1a1a', color: 'white', border: '1px solid #f97316' }}
          />
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              style={{ padding: '8px 12px', background: '#f97316', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Today
            </button>
          )}
        </div>
      </div>

      <div className="content-wrapper">
        <div className="form-section">
          <h2 className="section-title">{editingId ? '✏️ Edit Workout' : '➕ Add New Workout'}</h2>
          <form onSubmit={handleSubmit} className="workout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Exercise Name *</label>
                <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="e.g., Bench Press" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="strength">💪 Strength</option>
                  <option value="cardio">🏃 Cardio</option>
                  <option value="flexibility">🧘 Flexibility</option>
                  <option value="hiit">⚡ HIIT</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">📊 Intermediate</option>
                  <option value="advanced">🔥 Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (min)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 45" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sets *</label>
                <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="e.g., 3" required />
              </div>
              <div className="form-group">
                <label>Reps *</label>
                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g., 10" required />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 50" />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes about this exercise..." rows="2" />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., chest, push, heavy" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? '✏️ Update Workout' : '➕ Add Workout')}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-cancel">Cancel Edit</button>
              )}
            </div>
          </form>

        
        </div>

        <div className="list-section">
          <h2 className="section-title">
            📋 Workouts for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({workouts.length})
          </h2>
          {loading && <div className="loading-spinner">Loading...</div>}
          {!loading && workouts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💪</span>
              <h3>No workouts for this date</h3>
              <p>Add your first workout for {new Date(selectedDate).toLocaleDateString()}!</p>
            </div>
          ) : (
            <div className="workouts-list">
              {workouts.map((workout) => (
                <div key={workout._id} className="workout-item">
                  <div className="workout-item-header">
                    <div>
                      <h3>{workout.name}</h3>
                      <div className="workout-meta">
                        <span className={`badge category-${workout.category}`}>{workout.category}</span>
                        <span className={`badge difficulty-${workout.difficulty}`}>{workout.difficulty}</span>
                        {workout.duration > 0 && <span className="badge duration">⏱️ {workout.duration} min</span>}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(workout)} className="btn-edit" title="Edit">✏️</button>
                      <button onClick={() => handleDelete(workout._id)} className="btn-delete" title="Delete">🗑️</button>
                    </div>
                  </div>
                  <div className="workout-details">
                    {workout.exercises?.map((exercise, idx) => (
                      <div key={idx} className="exercise-item">
                        <strong>{exercise.exerciseName}</strong>
                        <div className="exercise-metrics">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight > 0 && <span>{exercise.weight} kg</span>}
                        </div>
                        {exercise.notes && <p className="exercise-notes">📝 {exercise.notes}</p>}
                      </div>
                    ))}
                  </div>
                  {workout.tags?.length > 0 && (
                    <div className="workout-tags">
                      {workout.tags.map((tag, idx) => <span key={idx} className="tag">#{tag}</span>)}
                    </div>
                  )}
                  <div className="workout-footer">
                    <small>Added: {new Date(workout.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Workouts;