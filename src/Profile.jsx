

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("/ProfileImages.avif");
  
  // Stats states
  const [workoutCount, setWorkoutCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  // Function to load profile image
  const loadProfileImage = () => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage && savedImage !== "null" && savedImage !== "undefined") {
      setProfileImage(savedImage);
    } else {
      const defaultImage = "/ProfileImages.avif";
      setProfileImage(defaultImage);
      localStorage.setItem("profileImage", defaultImage);
    }
  };

  useEffect(() => {
    // Load profile image
    loadProfileImage();

    // Check for updated image from navigation state
    if (location.state?.updatedImage) {
      setProfileImage(location.state.updatedImage);
      localStorage.setItem("profileImage", location.state.updatedImage);
      // Clear the state to avoid re-applying on re-render
      window.history.replaceState({}, document.title);
    }

    // Listen for storage changes (for cross-tab/component updates)
    const handleStorageChange = (e) => {
      if (e.key === "profileImage") {
        setProfileImage(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleProfileImageUpdate = (event) => {
      if (event.detail && event.detail.imageUrl) {
        setProfileImage(event.detail.imageUrl);
      }
    };
    
    window.addEventListener("profileImageUpdated", handleProfileImageUpdate);

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user data from localStorage
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedEmail = localStorage.getItem("email");
        const storedJoinDate = localStorage.getItem("joinDate");
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          if (!storedJoinDate && userData.createdAt) {
            localStorage.setItem("joinDate", userData.createdAt);
          }
        } else if (storedEmail) {
          const newUser = {
            email: storedEmail,
            name: storedEmail.split('@')[0],
            username: storedEmail.split('@')[0],
            createdAt: storedJoinDate || new Date().toISOString()
          };
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    // Fetch all stats
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      
      try {
        // Workouts
        const workoutsRes = await axios.get("http://localhost:3000/Workouts/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (workoutsRes.data.success) {
          const workouts = workoutsRes.data.data;
          setWorkoutCount(workouts.length);
          
          let totalTime = 0;
          workouts.forEach(workout => {
            totalTime += workout.duration || 0;
          });
          setTotalWorkoutTime(totalTime);
        }

        // Meals
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const mealsRes = await axios.get(
          `http://localhost:3000/Nutrition/list?startDate=${thirtyDaysAgo.toISOString().split('T')[0]}&endDate=${today.toISOString().split('T')[0]}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (mealsRes.data.success) {
          let totalMeals = 0;
          let calories = 0;
          
          mealsRes.data.data.forEach(entry => {
            const foodItems = entry.foodItems || [];
            totalMeals += foodItems.length;
            
            foodItems.forEach(item => {
              calories += item.calories || 0;
            });
          });
          
          setMealCount(totalMeals);
          setTotalCalories(calories);
        }

        // Days Active
        const joinDate = localStorage.getItem("joinDate");
        if (joinDate) {
          const joined = new Date(joinDate);
          const today = new Date();
          const diffTime = Math.abs(today - joined);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setActiveDays(diffDays);
        }

        // Calculate streak
        await calculateStreak(token);

      } catch (error) {
        console.error("Error fetching stats:", error);
        loadStatsFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const calculateStreak = async (token) => {
      try {
        const workoutsRes = await axios.get("http://localhost:3000/Workouts/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const mealsRes = await axios.get("http://localhost:3000/Nutrition/list?limit=100", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const activityDates = new Set();
        
        if (workoutsRes.data.success) {
          workoutsRes.data.data.forEach(workout => {
            if (workout.createdAt) {
              const date = new Date(workout.createdAt).toDateString();
              activityDates.add(date);
            }
          });
        }
        
        if (mealsRes.data.success) {
          mealsRes.data.data.forEach(meal => {
            if (meal.date) {
              const date = new Date(meal.date).toDateString();
              activityDates.add(date);
            }
          });
        }
        
        const sortedDates = Array.from(activityDates)
          .map(date => new Date(date))
          .sort((a, b) => a - b);
        
        let streak = 0;
        let maxStreak = 0;
        let prevDate = null;
        
        sortedDates.forEach(date => {
          if (prevDate) {
            const diffDays = Math.floor((date - prevDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              streak++;
            } else {
              streak = 1;
            }
          } else {
            streak = 1;
          }
          
          maxStreak = Math.max(maxStreak, streak);
          prevDate = date;
        });
        
        setStreakDays(maxStreak);
        
      } catch (error) {
        console.error("Error calculating streak:", error);
      }
    };

    const loadStatsFromLocalStorage = () => {
      try {
        const storedWorkouts = localStorage.getItem("workoutCount");
        const storedMeals = localStorage.getItem("mealCount");
        const storedActiveDays = localStorage.getItem("activeDays");
        
        if (storedWorkouts) setWorkoutCount(parseInt(storedWorkouts));
        if (storedMeals) setMealCount(parseInt(storedMeals));
        if (storedActiveDays) setActiveDays(parseInt(storedActiveDays));
        
        if (!storedWorkouts) setWorkoutCount(12);
        if (!storedMeals) setMealCount(8);
        if (!storedActiveDays) {
          const joinDate = localStorage.getItem("joinDate");
          if (joinDate) {
            const joined = new Date(joinDate);
            const today = new Date();
            const diffTime = Math.abs(today - joined);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setActiveDays(diffDays);
          } else {
            setActiveDays(5);
          }
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    };

    loadUserData();
    fetchStats();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileImageUpdated", handleProfileImageUpdate);
    };
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatWorkoutTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>No user data found. Please login again.</p>
        <button onClick={handleLogout} style={styles.loginBtn}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <h1 style={styles.pageTitle}>My Profile</h1>
          <p style={styles.pageSubtitle}>Welcome back, {user.name || user.username || user.email?.split('@')[0] || 'User'}! 👋</p>
        </div>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileCardHeader}>
            <h2 style={styles.cardTitle}>Profile Information</h2>
            <button 
              onClick={() => navigate("/EditProfile")} 
              style={styles.editButton}
            >
              ✎ Edit Profile
            </button>
          </div>

          <div style={styles.profileContent}>
            {/* Profile Picture Section */}
            <div style={styles.profilePicSection}>
              <div style={styles.profilePicContainer}>
                <img
                  src={profileImage}
                  alt={user.name || user.username || 'User'}
                  style={styles.profilePic}
                  onError={(e) => {
                    e.target.src = "/ProfileImages.avif";
                    setProfileImage("/ProfileImages.avif");
                    localStorage.setItem("profileImage", "/ProfileImages.avif");
                  }}
                />
              </div>
            </div>

            {/* Profile Details Section */}
            <div style={styles.profileDetails}>
              {user.name && (
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>
                    <span style={styles.labelIcon}>👤</span>
                    Full Name
                  </div>
                  <div style={styles.detailValue}>{user.name}</div>
                </div>
              )}

              {user.username && (
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>
                    <span style={styles.labelIcon}>@</span>
                    Username
                  </div>
                  <div style={styles.detailValue}>{user.username}</div>
                </div>
              )}

              {user.email && (
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>
                    <span style={styles.labelIcon}>📧</span>
                    Email Address
                  </div>
                  <div style={styles.detailValue}>{user.email}</div>
                </div>
              )}

              {user.createdAt && (
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>
                    <span style={styles.labelIcon}>📅</span>
                    Member Since
                  </div>
                  <div style={styles.detailValue}>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏋️</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{workoutCount}</h3>
              <p style={styles.statLabel}>Total Workouts</p>
              {totalWorkoutTime > 0 && (
                <p style={styles.statSubtext}>{formatWorkoutTime(totalWorkoutTime)} total</p>
              )}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🥗</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{mealCount}</h3>
              <p style={styles.statLabel}>Meals Logged</p>
              {totalCalories > 0 && (
                <p style={styles.statSubtext}>{totalCalories} calories</p>
              )}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{activeDays}</h3>
              <p style={styles.statLabel}>Days Active</p>
              {streakDays > 0 && (
                <p style={styles.statSubtext}>🔥 {streakDays} day streak</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{totalCalories}</h3>
              <p style={styles.statLabel}>Calories Burned</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚡</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{streakDays}</h3>
              <p style={styles.statLabel}>Day Streak</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏱️</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{formatWorkoutTime(totalWorkoutTime)}</h3>
              <p style={styles.statLabel}>Workout Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles remain the same as your original...
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingTop: "2rem",
    color: "#ffffff"
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem"
  },
  profileHeader: {
    marginBottom: "2rem",
    background: "#111111",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid #333333",
    boxShadow: "0 4px 20px rgba(249, 115, 22, 0.1)"
  },
  pageTitle: {
    fontSize: "2.5rem",
    color: "#f97316",
    margin: "0 0 0.5rem 0",
    fontWeight: "700",
    textShadow: "0 0 15px rgba(249, 115, 22, 0.3)"
  },
  pageSubtitle: {
    fontSize: "1.1rem",
    color: "#a3a3a3",
    margin: 0
  },
  profileCard: {
    backgroundColor: "#111111",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(249, 115, 22, 0.1)",
    overflow: "hidden",
    marginBottom: "2rem",
    border: "1px solid #333333",
    transition: "all 0.3s ease"
  },
  profileCardHeader: {
    padding: "1.5rem 2rem",
    borderBottom: "1px solid #333333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a"
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#f97316",
    margin: 0,
    fontWeight: "600"
  },
  editButton: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#f97316",
    color: "#000000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(249, 115, 22, 0.3)"
  },
  profileContent: {
    padding: "2rem",
    display: "flex",
    gap: "3rem",
    flexWrap: "wrap"
  },
  profilePicSection: {
    flex: "0 0 200px"
  },
  profilePicContainer: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(249, 115, 22, 0.2)",
    border: "3px solid #f97316",
    transition: "all 0.3s ease"
  },
  profilePic: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  profileDetails: {
    flex: 1,
    minWidth: "300px"
  },
  detailRow: {
    display: "flex",
    padding: "1rem 0",
    borderBottom: "1px solid #333333",
    transition: "all 0.2s ease"
  },
  detailLabel: {
    width: "150px",
    color: "#a3a3a3",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  labelIcon: {
    fontSize: "1.2rem",
    color: "#f97316"
  },
  detailValue: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "500"
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1.5rem"
  },
  statCard: {
    backgroundColor: "#111111",
    borderRadius: "15px",
    padding: "1.5rem",
    boxShadow: "0 4px 15px rgba(249, 115, 22, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    border: "1px solid #333333",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden"
  },
  statIcon: {
    fontSize: "2rem",
    width: "60px",
    height: "60px",
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f97316",
    border: "1px solid #333333"
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: "1.8rem",
    color: "#f97316",
    margin: "0 0 0.25rem 0",
    fontWeight: "700",
    textShadow: "0 0 15px rgba(249, 115, 22, 0.3)"
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#a3a3a3",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  statSubtext: {
    fontSize: "0.8rem",
    color: "#666666",
    margin: "0.25rem 0 0 0"
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    color: "#ffffff"
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "3px solid #333333",
    borderTop: "3px solid #f97316",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    marginTop: "1rem",
    color: "#f97316"
  },
  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    color: "#ffffff"
  },
  errorText: {
    color: "#ef4444",
    fontSize: "1.1rem",
    marginBottom: "1rem"
  },
  loginBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f97316",
    color: "#000000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(249, 115, 22, 0.3)"
  }
};

// Add animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f97316;
  }
`;
document.head.appendChild(styleSheet);

export default Profile;