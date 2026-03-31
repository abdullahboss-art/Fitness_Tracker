import React, { useState } from 'react';
import './ProgressDashboard.css';


const ProgressDashboard = () => {
  const [stats, setStats] = useState({
    totalEntries: 6,
    totalMeasurements: 6,
    totalWeightChange: 32984,
    recentEntries: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showForm, setShowForm] = useState(false);

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(75.5);
  const [previousWeight] = useState(77.0);
  const [notes, setNotes] = useState('');
  const [weightAnalysis] = useState(null);
  
  const [progressEntries, setProgressEntries] = useState([
    { 
      id: 1, 
      date: '15 Mar 2024',
      weight: 75.5,
      change: -1.5,
      diet: 'Followed',
      workout: 'Done',
      type: 'loss'
    },
    { 
      id: 2, 
      date: '10 Mar 2024',
      weight: 77.0,
      change: 1.5,
      diet: 'Not Followed',
      workout: 'Done',
      type: 'gain'
    },
    { 
      id: 3, 
      date: '5 Mar 2024',
      weight: 76.2,
      change: 0,
      diet: 'Followed',
      workout: 'Done',
      type: 'stable'
    }
  ]);

  // Smart weight analysis function
 
  // ✅ YEH SAHI JAGAH HAI - COMPONENT KE TOP LEVEL PAR


  // Handle weight change
  const handleWeightChange = (e) => {
    const newWeight = parseFloat(e.target.value);
    setCurrentWeight(newWeight);

    if (newWeight < previousWeight) {
      setSuggestionMessage('🎯 Weight loss found! Nutrition page par jayein?');
      setRedirectTo('nutrition');
      setShowSuggestion(true);
    } else if (newWeight > previousWeight) {
      setSuggestionMessage('💪 Weight gain detected! Workout page par jayein?');
      setRedirectTo('workout');
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  };

  const handleRedirect = (page) => {
    if (page === 'nutrition' || page === 'diet') {
      window.location.href = '/nutrition';
    } else if (page === 'workout') {
      window.location.href = '/workout';
    }
  };

  // Save Progress Function
  const handleSaveProgress = () => {
    const newEntry = {
      id: progressEntries.length + 1,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      weight: currentWeight,
      change: parseFloat((currentWeight - previousWeight).toFixed(1)),
      diet: 'Followed',
      workout: 'Planned',
      type: currentWeight < previousWeight ? 'loss' : currentWeight > previousWeight ? 'gain' : 'stable'
    };

    setProgressEntries([newEntry, ...progressEntries]);
    
    setStats({
      totalEntries: stats.totalEntries + 1,
      totalMeasurements: stats.totalMeasurements + 1,
      totalWeightChange: stats.totalWeightChange + (currentWeight - previousWeight),
      recentEntries: [newEntry, ...stats.recentEntries]
    });

    setShowForm(false);
    setNotes('');
    setShowSuggestion(false);
    alert('✅ Progress saved successfully!');
  };

  return (
    <div className="progress-container">
      {/* Header */}
      <div className="progress-header">
        <h1 className="progress-title">
          <span className="title-gradient">Fitness Tracker</span>
          <span className="progress-subtitle">
            Progress Tracker Pro - Track your fitness journey like a pro
          </span>
        </h1>
      </div>

      {/* Navigation Bar */}
      

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-effect">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEntries}</div>
            <div className="stat-label">TOTAL ENTRIES</div>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon">📏</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMeasurements}</div>
            <div className="stat-label">TOTAL MEASUREMENTS</div>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.totalWeightChange.toLocaleString()} kg
            </div>
            <div className="stat-label">TOTAL WEIGHT CHANGE</div>
          </div>
        </div>
      </div>

      {/* Analysis Banner */}
      {weightAnalysis && (
        <div className={`analysis-banner ${weightAnalysis.type}`}>
          <div className="analysis-icon">
            {weightAnalysis.type === 'loss' ? '🎉' : weightAnalysis.type === 'gain' ? '⚠️' : '📊'}
          </div>
          <div className="analysis-content">
            <p className="analysis-message">{weightAnalysis.message}</p>
            <p className="analysis-suggestion">{weightAnalysis.suggestion}</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search progress..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All Categories</option>
          <option>Weight</option>
          <option>Measurements</option>
          <option>Performance</option>
          <option>Strength</option>
          <option>Cardio</option>
        </select>

        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Add New Progress
        </button>
      </div>

      {/* Progress List */}
      <div className="progress-list">
        <h2>Recent Progress</h2>
        <div className="progress-items">
          {progressEntries.map((item) => (
            <div key={item.id} className={`progress-item ${item.type} glass-effect`}>
              <div className="item-header">
                <div className="item-date">{item.date}</div>
                <div className={`item-type-badge ${item.type}`}>
                  {item.type === 'loss' ? '▼ LOSS' : item.type === 'gain' ? '▲ GAIN' : '◆ STABLE'}
                </div>
              </div>
              <div className="item-details">
                <span className="item-weight">{item.weight} kg</span>
                <span className={`item-change ${item.type}`}>
                  {item.change > 0 ? '+' : ''}{item.change} kg
                </span>
              </div>
              <div className="item-status">
                <span className={`status-badge ${item.diet === 'Followed' ? 'success' : 'warning'}`}>
                  🍎 Diet: {item.diet}
                </span>
                <span className={`status-badge ${item.workout === 'Done' ? 'success' : 'info'}`}>
                  💪 Workout: {item.workout}
                </span>
              </div>
              
              {/* Sirf 1 button based on type */}
              <div className="item-button-container">
                {item.type === 'loss' && (
                  <button 
                    className="item-btn nutrition-btn"
                    onClick={() => handleRedirect('nutrition')}
                  >
                     Nutrition Plan (Weight Loss)
                  </button>
                )}
                
                {item.type === 'gain' && (
                  <button 
                    className="item-btn workout-btn"
                    onClick={() => handleRedirect('workout')}
                  >
                    💪 Workout Plan (Weight Gain)
                  </button>
                )}
                
                {item.type === 'stable' && (
                  <div className="dual-buttons">
                    <button 
                      className="item-btn nutrition-btn small"
                      onClick={() => handleRedirect('nutrition')}
                    >
                      🍎 Nutrition
                    </button>
                    <button 
                      className="item-btn workout-btn small"
                      onClick={() => handleRedirect('workout')}
                    >
                      💪 Workout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Progress Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <h2>Add New Progress</h2>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter weight..."
                className="modal-search"
                onChange={handleWeightChange}
                value={currentWeight}
              />
            </div>

            {showSuggestion && (
              <div className={`suggestion-popup ${redirectTo}`}>
                <p>{suggestionMessage}</p>
                <div className="suggestion-actions">
                  <button
                    className="btn-redirect"
                    onClick={() => handleRedirect(redirectTo)}
                  >
                    Yes, take me to {redirectTo === 'nutrition' ? 'Nutrition' : 'Workout'} page
                  </button>
                  <button
                    className="btn-dismiss"
                    onClick={() => setShowSuggestion(false)}
                  >
                    No, continue here
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Notes</label>
              <textarea
                placeholder="How was your workout/nutrition today?"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveProgress}>
                💾 Save Progress
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PDF Download */}
      {/* <button
        className="btn-download"
        onClick={() => generateFitnessReport({ stats, progressEntries })}
      >
        📄 Download Fitness Report (PDF)
      </button> */}
    </div>
    
  );
};

export default ProgressDashboard;