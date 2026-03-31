

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { NotificationContext } from './Context/NotificationContext'; 

const NutritionDashboard = ({ token: propToken }) => {
  // Get token from props or localStorage
  const [token, setToken] = useState(propToken || localStorage.getItem('token'));
  
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  
  // Stats
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);

  // New Food Form
  const [newFoodItem, setNewFoodItem] = useState({
    name: "",
    quantity: { value: "", unit: "g" },
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Check if user is logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Stored Token:", storedToken); // Debug log
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch Entries
  const fetchEntries = useCallback(async (showRefresh = false) => {
    const currentToken = token || localStorage.getItem('token');
    
    console.log("Current Token:", currentToken); // Debug log
    console.log("Selected Date:", selectedDate); // Debug log
    
    if (!currentToken) {
      console.error("No token found!");
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      console.log("Fetching entries for date:", selectedDate);
      
      const response = await axios.get(
        `http://localhost:3000/Nutrition/list?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data.success) {
        const data = response.data.data;
        console.log("Fetched Data:", data); // Debug log
        
        setEntries(data);

        // Calculate stats
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fats = 0;

        data.forEach((entry) => {
          console.log("Processing Entry:", entry); // Debug log
          
          // Agar totalCalories directly ho to
          if (entry.totalCalories) {
            calories += entry.totalCalories || 0;
            protein += entry.totalProtein || 0;
            carbs += entry.totalCarbs || 0;
            fats += entry.totalFats || 0;
          } 
          // Agar foodItems array ho to
          else if (entry.foodItems && entry.foodItems.length > 0) {
            entry.foodItems.forEach(item => {
              calories += item.calories || 0;
              protein += item.protein || 0;
              carbs += item.carbs || 0;
              fats += item.fats || 0;
            });
          }
        });

        console.log("Calculated Stats:", { calories, protein, carbs, fats }); // Debug log

        // Update stats
        setTotalCalories(calories);
        setTotalProtein(protein);
        setTotalCarbs(carbs);
        setTotalFats(fats);
      } else {
        console.error("API Error:", response.data.message);
      }
    } catch (error) {
      console.error("Fetch Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate, token]);

  // Load data on mount and date change
  useEffect(() => {
    if (token) {
      fetchEntries(true);
    } else {
      console.log("Waiting for token...");
    }
  }, [fetchEntries, token]);

  // Add Food Item
  const handleAddFoodItem = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!newFoodItem.name) {
        alert("Please enter food name");
        return;
      }
      if (!newFoodItem.quantity.value) {
        alert("Please enter quantity");
        return;
      }
      if (!newFoodItem.calories) {
        alert("Please enter calories");
        return;
      }

      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        alert("Please login first");
        return;
      }

      const caloriesNum = Number(newFoodItem.calories);
      const proteinNum = Number(newFoodItem.protein) || 0;
      const carbsNum = Number(newFoodItem.carbs) || 0;
      const fatsNum = Number(newFoodItem.fats) || 0;

      const entryData = {
        mealType: selectedMeal,
        date: new Date(selectedDate).toISOString(),
        foodItems: [
          {
            name: newFoodItem.name,
            quantity: {
              value: Number(newFoodItem.quantity.value),
              unit: newFoodItem.quantity.unit,
            },
            calories: caloriesNum,
            protein: proteinNum,
            carbs: carbsNum,
            fats: fatsNum,
          },
        ],
        totalCalories: caloriesNum,
        totalProtein: proteinNum,
        totalCarbs: carbsNum,
        totalFats: fatsNum
      };

      console.log("Sending Data:", entryData); // Debug log

      const res = await axios.post(
        "http://localhost:3000/Nutrition/add",
        entryData,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      console.log("Add Response:", res.data); // Debug log

      if (res.data.success) {
        alert("Food Added Successfully!");
        setShowAddForm(false);
        
        // Form reset
        setNewFoodItem({
          name: "",
          quantity: { value: "", unit: "g" },
          calories: "",
          protein: "",
          carbs: "",
          fats: "",
        });
        
        // Refresh data
        fetchEntries(true);
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Add Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error adding food: " + (error.response?.data?.error || error.message));
      }
    }
  };

  // Delete Food Entry
  const handleDeleteEntry = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const currentToken = token || localStorage.getItem('token');
        
        const res = await axios.delete(
          `http://localhost:3000/Nutrition/delete/${entryId}`,
          {
            headers: { Authorization: `Bearer ${currentToken}` },
          }
        );

        console.log("Delete Response:", res.data); // Debug log

        if (res.data.success) {
          alert("Entry deleted successfully");
          fetchEntries(true);
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Error deleting entry");
      }
    }
  };

  // Search
  const filteredEntries = entries.filter((entry) =>
    entry.foodItems?.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Meal Groups
  const meals = {
    breakfast: filteredEntries.filter((e) => e.mealType === "breakfast"),
    lunch: filteredEntries.filter((e) => e.mealType === "lunch"),
    dinner: filteredEntries.filter((e) => e.mealType === "dinner"),
    snacks: filteredEntries.filter((e) => e.mealType === "snacks"),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🍏 Nutrition Tracker</h1>
        <div style={styles.statsBadge}>
          <span>📅 {new Date(selectedDate).toLocaleDateString()}</span>
          {refreshing && <span style={styles.refreshIcon}>🔄</span>}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard}}>
          <div style={styles.statValue}>{totalCalories}</div>
          <div style={styles.statLabel}>CALORIES</div>
          {refreshing && <div style={styles.smallLoader}></div>}
        </div>
        <div style={{...styles.statCard}}>
          <div style={styles.statValue}>{totalProtein}g</div>
          <div style={styles.statLabel}>PROTEIN</div>
          {refreshing && <div style={styles.smallLoader}></div>}
        </div>
        <div style={{...styles.statCard}}>
          <div style={styles.statValue}>{totalCarbs}g</div>
          <div style={styles.statLabel}>CARBS</div>
          {refreshing && <div style={styles.smallLoader}></div>}
        </div>
        <div style={{...styles.statCard}}>
          <div style={styles.statValue}>{totalFats}g</div>
          <div style={styles.statLabel}>FATS</div>
          {refreshing && <div style={styles.smallLoader}></div>}
        </div>
      </div>

      {/* Test Data Button - FOR TESTING ONLY */}
      {/* <div style={{marginBottom: '20px', textAlign: 'center'}}>
        <button 
          onClick={() => {
            // Demo data for testing
            setTotalCalories(1250);
            setTotalProtein(65);
            setTotalCarbs(120);
            setTotalFats(35);
          }}
          style={{
            padding: '10px 20px',
            background: '#f97316',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Load Test Data (Click to see if UI works)
        </button>
      </div> */}

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.controlGroup}>
          <select
            style={styles.select}
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
          >
            <option value="breakfast">🍳 Breakfast</option>
            <option value="lunch">🍱 Lunch</option>
            <option value="dinner">🍽️ Dinner</option>
            <option value="snacks">🍪 Snacks</option>
          </select>

          <input
            style={styles.dateInput}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
            + New Entry
          </button>
        </div>
      </div>

      {/* Rest of your code remains the same... */}
      {loading && !refreshing && (
        <div style={styles.fullPageLoader}>
          <div style={styles.spinner}></div>
          <p>Loading your nutrition data...</p>
        </div>
      )}

      {/* Meals Grid */}
      {!loading && (
        <div style={styles.mealsGrid}>
          {/* Breakfast */}
          <div style={styles.mealCard}>
            <div style={styles.mealHeader}>
              <h3 style={styles.mealTitle}>🍳 Breakfast</h3>
              <span style={styles.mealCount}>{meals.breakfast.length}</span>
            </div>
            <div style={styles.mealBody}>
              {meals.breakfast.length === 0 ? (
                <p style={styles.emptyMeal}>No items</p>
              ) : (
                meals.breakfast.map((entry) => (
                  <div key={entry._id} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <span style={styles.entryTime}>
                        {new Date(entry.date).toLocaleTimeString()}
                      </span>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        🗑️
                      </button>
                    </div>
                    {entry.foodItems.map((item, i) => (
                      <div key={i} style={styles.foodRow}>
                        <span style={styles.foodName}>{item.name}</span>
                        <span style={styles.foodQuantity}>
                          {item.quantity.value}{item.quantity.unit}
                        </span>
                        <span style={styles.foodCalories}>
                          {item.calories} cal
                        </span>
                        <span style={styles.foodMacros}>
                          P:{item.protein} C:{item.carbs} F:{item.fats}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lunch */}
          <div style={styles.mealCard}>
            <div style={styles.mealHeader}>
              <h3 style={styles.mealTitle}>🍱 Lunch</h3>
              <span style={styles.mealCount}>{meals.lunch.length}</span>
            </div>
            <div style={styles.mealBody}>
              {meals.lunch.length === 0 ? (
                <p style={styles.emptyMeal}>No items</p>
              ) : (
                meals.lunch.map((entry) => (
                  <div key={entry._id} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <span style={styles.entryTime}>
                        {new Date(entry.date).toLocaleTimeString()}
                      </span>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        🗑️
                      </button>
                    </div>
                    {entry.foodItems.map((item, i) => (
                      <div key={i} style={styles.foodRow}>
                        <span style={styles.foodName}>{item.name}</span>
                        <span style={styles.foodQuantity}>
                          {item.quantity.value}{item.quantity.unit}
                        </span>
                        <span style={styles.foodCalories}>
                          {item.calories} cal
                        </span>
                        <span style={styles.foodMacros}>
                          P:{item.protein} C:{item.carbs} F:{item.fats}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dinner */}
          <div style={styles.mealCard}>
            <div style={styles.mealHeader}>
              <h3 style={styles.mealTitle}>🍽️ Dinner</h3>
              <span style={styles.mealCount}>{meals.dinner.length}</span>
            </div>
            <div style={styles.mealBody}>
              {meals.dinner.length === 0 ? (
                <p style={styles.emptyMeal}>No items</p>
              ) : (
                meals.dinner.map((entry) => (
                  <div key={entry._id} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <span style={styles.entryTime}>
                        {new Date(entry.date).toLocaleTimeString()}
                      </span>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        🗑️
                      </button>
                    </div>
                    {entry.foodItems.map((item, i) => (
                      <div key={i} style={styles.foodRow}>
                        <span style={styles.foodName}>{item.name}</span>
                        <span style={styles.foodQuantity}>
                          {item.quantity.value}{item.quantity.unit}
                        </span>
                        <span style={styles.foodCalories}>
                          {item.calories} cal
                        </span>
                        <span style={styles.foodMacros}>
                          P:{item.protein} C:{item.carbs} F:{item.fats}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Snacks */}
          <div style={styles.mealCard}>
            <div style={styles.mealHeader}>
              <h3 style={styles.mealTitle}>🍪 Snacks</h3>
              <span style={styles.mealCount}>{meals.snacks.length}</span>
            </div>
            <div style={styles.mealBody}>
              {meals.snacks.length === 0 ? (
                <p style={styles.emptyMeal}>No items</p>
              ) : (
                meals.snacks.map((entry) => (
                  <div key={entry._id} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <span style={styles.entryTime}>
                        {new Date(entry.date).toLocaleTimeString()}
                      </span>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        🗑️
                      </button>
                    </div>
                    {entry.foodItems.map((item, i) => (
                      <div key={i} style={styles.foodRow}>
                        <span style={styles.foodName}>{item.name}</span>
                        <span style={styles.foodQuantity}>
                          {item.quantity.value}{item.quantity.unit}
                        </span>
                        <span style={styles.foodCalories}>
                          {item.calories} cal
                        </span>
                        <span style={styles.foodMacros}>
                          P:{item.protein} C:{item.carbs} F:{item.fats}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - Add New Food Form */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Food</h3>
              <button 
                style={styles.modalClose}
                onClick={() => setShowAddForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFoodItem}>
              {/* Food Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Food Name *</label>
                <input
                  style={styles.input}
                  placeholder="e.g., Oatmeal, Chicken"
                  value={newFoodItem.name}
                  onChange={(e) =>
                    setNewFoodItem({ ...newFoodItem, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Quantity and Unit */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity *</label>
                  <input
                    style={styles.input}
                    placeholder="Amount"
                    type="number"
                    value={newFoodItem.quantity.value}
                    onChange={(e) =>
                      setNewFoodItem({
                        ...newFoodItem,
                        quantity: {
                          ...newFoodItem.quantity,
                          value: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Unit</label>
                  <select
                    style={styles.input}
                    value={newFoodItem.quantity.unit}
                    onChange={(e) =>
                      setNewFoodItem({
                        ...newFoodItem,
                        quantity: {
                          ...newFoodItem.quantity,
                          unit: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="g">grams (g)</option>
                    <option value="ml">milliliters (ml)</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tablespoon</option>
                    <option value="tsp">teaspoon</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              {/* Calories and Protein */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Calories *</label>
                  <input
                    style={styles.input}
                    placeholder="Calories"
                    type="number"
                    value={newFoodItem.calories}
                    onChange={(e) =>
                      setNewFoodItem({ ...newFoodItem, calories: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Protein (g)</label>
                  <input
                    style={styles.input}
                    placeholder="Protein"
                    type="number"
                    value={newFoodItem.protein}
                    onChange={(e) =>
                      setNewFoodItem({ ...newFoodItem, protein: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Carbs and Fats */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Carbs (g)</label>
                  <input
                    style={styles.input}
                    placeholder="Carbs"
                    type="number"
                    value={newFoodItem.carbs}
                    onChange={(e) =>
                      setNewFoodItem({ ...newFoodItem, carbs: e.target.value })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Fats (g)</label>
                  <input
                    style={styles.input}
                    placeholder="Fats"
                    type="number"
                    value={newFoodItem.fats}
                    onChange={(e) =>
                      setNewFoodItem({ ...newFoodItem, fats: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  style={styles.cancelBtn}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles remain the same...
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: '#ffffff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#111111',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.15)',
    border: '1px solid #333333'
  },
  logo: {
    margin: 0,
    fontSize: '24px',
    color: '#f97316',
    fontWeight: '700',
    textShadow: '0 0 10px rgba(249, 115, 22, 0.3)'
  },
  statsBadge: {
    padding: '8px 16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '20px',
    color: '#f97316',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #333333'
  },
  refreshIcon: {
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    color: '#f97316'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: '#111111',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.1)',
    position: 'relative',
    border: '1px solid #333333',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderBottom: '3px solid #f97316'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: '5px',
    textShadow: '0 0 15px rgba(249, 115, 22, 0.3)'
  },
  statLabel: {
    fontSize: '14px',
    color: '#a3a3a3',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  smallLoader: {
    width: '16px',
    height: '16px',
    border: '2px solid #333333',
    borderTop: '2px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  controls: {
    backgroundColor: '#111111',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.1)',
    border: '1px solid #333333'
  },
  searchBox: {
    marginBottom: '15px'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #333333',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    transition: 'all 0.3s ease'
  },
  controlGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '10px',
    border: '1px solid #333333',
    borderRadius: '6px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: '14px',
    minWidth: '150px',
    flex: 1,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  dateInput: {
    padding: '10px',
    border: '1px solid #333333',
    borderRadius: '6px',
    fontSize: '14px',
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    transition: 'all 0.3s ease'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#f97316',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)'
  },
  fullPageLoader: {
    textAlign: 'center',
    padding: '50px',
    color: '#f97316'
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 15px',
    border: '3px solid #333333',
    borderTop: '3px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  mealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  mealCard: {
    backgroundColor: '#111111',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.1)',
    overflow: 'hidden',
    border: '1px solid #333333',
    transition: 'all 0.3s ease'
  },
  mealHeader: {
    backgroundColor: '#1a1a1a',
    padding: '15px 20px',
    borderBottom: '1px solid #333333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mealTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#f97316',
    fontWeight: '600'
  },
  mealCount: {
    backgroundColor: '#f97316',
    color: '#000000',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  mealBody: {
    padding: '15px',
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: '#111111'
  },
  emptyMeal: {
    textAlign: 'center',
    color: '#a3a3a3',
    fontStyle: 'italic',
    padding: '20px'
  },
  entryCard: {
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    border: '1px solid #333333',
    transition: 'all 0.2s ease'
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  entryTime: {
    fontSize: '12px',
    color: '#a3a3a3'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 4px',
    color: '#ef4444',
    transition: 'all 0.2s ease'
  },
  foodRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '8px',
    padding: '6px 0',
    borderBottom: '1px dashed #333333',
    fontSize: '13px'
  },
  foodName: {
    color: '#ffffff',
    fontWeight: '500'
  },
  foodQuantity: {
    color: '#a3a3a3'
  },
  foodCalories: {
    color: '#f97316',
    fontWeight: '600'
  },
  foodMacros: {
    color: '#f97316',
    fontSize: '11px',
    opacity: '0.8'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modal: {
    backgroundColor: '#111111',
    borderRadius: '12px',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.2)',
    border: '1px solid #f97316'
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #333333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a'
  },
  modalTitle: {
    margin: 0,
    color: '#f97316',
    fontWeight: '600'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#a3a3a3',
    transition: 'all 0.2s ease'
  },
  modalFooter: {
    padding: '20px',
    borderTop: '1px solid #333333',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    backgroundColor: '#1a1a1a'
  },
  formGroup: {
    marginBottom: '15px',
    flex: 1
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#f97316',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #333333',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    transition: 'all 0.3s ease'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#a3a3a3',
    border: '1px solid #333333',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#f97316',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)'
  }
};

// Add keyframes animation and hover effects
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Hover Effects */
  .stat-card:hover {
    transform: translateY(-2px);
    border-color: #f97316 !important;
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.2) !important;
  }

  .search-input:focus {
    outline: none;
    border-color: #f97316 !important;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
  }

  .select:hover, .date-input:hover, .input:hover {
    border-color: #f97316 !important;
  }

  .add-button:hover, .submit-btn:hover {
    background-color: #ea580c !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(249, 115, 22, 0.4) !important;
  }

  .meal-card:hover {
    transform: translateY(-2px);
    border-color: #f97316 !important;
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.15) !important;
  }

  .entry-card:hover {
    border-color: #f97316 !important;
    background-color: #222222 !important;
  }

  .delete-btn:hover {
    color: #f97316 !important;
    transform: scale(1.1);
  }

  .cancel-btn:hover {
    background-color: #333333 !important;
    color: #ffffff !important;
  }

  .modal-close:hover {
    color: #f97316 !important;
  }

  /* Scrollbar Styling */
  .meal-body::-webkit-scrollbar {
    width: 8px;
  }

  .meal-body::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  .meal-body::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 4px;
  }

  .meal-body::-webkit-scrollbar-thumb:hover {
    background: #f97316;
  }

  .stat-card {
    border-left: none !important;
  }
`;
document.head.appendChild(style);

export default NutritionDashboard;