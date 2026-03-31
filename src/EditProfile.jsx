import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoals: "",
    activityLevel: "beginner"
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load user data from localStorage
    loadUserData();
    
    // Load profile image from localStorage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage && savedImage !== "null" && savedImage !== "undefined") {
      setPreviewUrl(savedImage);
    }
  }, []);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFormData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          dateOfBirth: user.dateOfBirth || "",
          gender: user.gender || "",
          height: user.height || "",
          weight: user.weight || "",
          fitnessGoals: user.fitnessGoals || "",
          activityLevel: user.activityLevel || "beginner"
        });
        
        // Check for profile picture in user object first
        if (user.profilePic) {
          setPreviewUrl(user.profilePic);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setPreviewUrl(imageUrl);
        
        // IMPORTANT: Immediately save to localStorage for real-time update
        localStorage.setItem("profileImage", imageUrl);
        
        // Dispatch custom event for Profile component to update in real-time
        // This is key for updating the image without page refresh
        window.dispatchEvent(new CustomEvent("profileImageUpdated", {
          detail: { imageUrl: imageUrl }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      // Create form data for image upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append image if selected
      if (selectedImage) {
        submitData.append("profilePic", selectedImage);
      }

      // Try to save to backend (if available)
      try {
        await axios.put("http://localhost:5000/api/users/profile", submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (err) {
        console.log("Backend not available, saving locally only:", err.message);
      }

      // Update localStorage with new data
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Get the final image URL (either from selected image or existing)
      const finalImageUrl = selectedImage ? previewUrl : (existingUser.profilePic || localStorage.getItem("profileImage"));
      
      const updatedUser = {
        ...existingUser,
        ...formData,
        profilePic: finalImageUrl
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Ensure profile image is saved separately
      if (selectedImage && previewUrl) {
        localStorage.setItem("profileImage", previewUrl);
      }
      
      setSuccess("Profile updated successfully!");
      
      // Dispatch event to notify Profile component about the update
      window.dispatchEvent(new CustomEvent("profileImageUpdated", {
        detail: { imageUrl: finalImageUrl }
      }));
      
      // Also dispatch storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'profileImage',
        newValue: finalImageUrl
      }));
      
      // Redirect after 2 seconds with state
      setTimeout(() => {
        // Navigate with state to ensure Profile component knows image was updated
        navigate("/Profile", { 
          state: { 
            updatedImage: finalImageUrl,
            profileUpdated: true 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "rgb(10 10 10)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    mainContent: {
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "0 2rem"
    },
    header: {
      marginBottom: "2rem"
    },
    title: {
      fontSize: "2rem",
      color: "#f97316",
      margin: "0 0 0.5rem 0"
    },
    subtitle: {
      fontSize: "1rem",
      color: "#a3a3a3",
      margin: 0
    },
    formCard: {
      backgroundColor: "#111111",
      borderRadius: "15px",
      boxShadow: "0 4px 6px rgba(249, 115, 22, 0.1)",
      padding: "2rem",
      border: "1px solid #333333"
    },
    profileImageSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "2rem",
      paddingBottom: "2rem",
      borderBottom: "1px solid #333333"
    },
    imageContainer: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      overflow: "hidden",
      marginBottom: "1rem",
      boxShadow: "0 4px 20px rgba(249, 115, 22, 0.2)",
      border: "3px solid #f97316"
    },
    profileImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    imageUploadBtn: {
      position: "relative",
      overflow: "hidden",
      display: "inline-block"
    },
    uploadButton: {
      backgroundColor: "#1a1a1a",
      color: "#f97316",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
      border: "2px solid #f97316",
      transition: "all 0.3s",
      fontWeight: "600"
    },
    fileInput: {
      position: "absolute",
      left: 0,
      top: 0,
      opacity: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1.5rem",
      marginBottom: "1.5rem"
    },
    formGroup: {
      marginBottom: "1rem"
    },
    fullWidth: {
      gridColumn: "span 2"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#f97316",
      fontWeight: "600",
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "2px solid #333333",
      borderRadius: "5px",
      fontSize: "1rem",
      transition: "all 0.3s",
      boxSizing: "border-box",
      backgroundColor: "#1a1a1a",
      color: "#ffffff"
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: "2px solid #333333",
      borderRadius: "5px",
      fontSize: "1rem",
      minHeight: "100px",
      resize: "vertical",
      boxSizing: "border-box",
      backgroundColor: "#1a1a1a",
      color: "#ffffff"
    },
    select: {
      width: "100%",
      padding: "0.75rem",
      border: "2px solid #333333",
      borderRadius: "5px",
      fontSize: "1rem",
      backgroundColor: "#1a1a1a",
      cursor: "pointer",
      color: "#ffffff"
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "2rem",
      paddingTop: "1rem",
      borderTop: "1px solid #333333"
    },
    saveButton: {
      padding: "0.75rem 2rem",
      backgroundColor: "#f97316",
      color: "#000000",
      border: "none",
      borderRadius: "5px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      opacity: saving ? 0.7 : 1,
      boxShadow: "0 4px 10px rgba(249, 115, 22, 0.3)"
    },
    cancelButton: {
      padding: "0.75rem 2rem",
      backgroundColor: "#1a1a1a",
      color: "#f97316",
      border: "2px solid #f97316",
      borderRadius: "5px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s"
    },
    alert: {
      padding: "1rem",
      borderRadius: "5px",
      marginBottom: "1rem",
      fontSize: "0.9rem"
    },
    successAlert: {
      backgroundColor: "rgba(76, 175, 80, 0.1)",
      color: "#4caf50",
      border: "1px solid #4caf50"
    },
    errorAlert: {
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      color: "#f44336",
      border: "1px solid #f44336"
    },
    loadingContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a0a0a"
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
    }
  };

  // Add animation keyframes
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #f97316 !important;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
      }
      input:hover, select:hover, textarea:hover {
        border-color: #f97316 !important;
      }
      .upload-btn:hover {
        background-color: #f97316 !important;
        color: #000000 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
      }
      .save-btn:hover {
        background-color: #ff8c00 !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
      }
      .cancel-btn:hover {
        background-color: #f97316 !important;
        color: #000000 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
      }
      select option {
        background-color: #1a1a1a;
        color: #f97316;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Profile</h1>
          <p style={styles.subtitle}>Update your personal information and fitness details</p>
        </div>

        {success && (
          <div style={{...styles.alert, ...styles.successAlert}}>
            {success}
          </div>
        )}

        {error && (
          <div style={{...styles.alert, ...styles.errorAlert}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.formCard}>
          {/* Profile Image Upload */}
          <div style={styles.profileImageSection}>
            <div style={styles.imageContainer}>
              <img
                src={previewUrl || "/ProfileImages.avif"}
                alt="Profile"
                style={styles.profileImage}
                onError={(e) => {
                  e.target.src = "/ProfileImages.avif";
                  setPreviewUrl("/ProfileImages.avif");
                }}
              />
            </div>
            <div style={styles.imageUploadBtn}>
              <button 
                type="button" 
                style={styles.uploadButton}
                className="upload-btn"
              >
                Change Profile Photo
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
            </div>
          </div>

          {/* Form Grid - Same as before */}
          <div style={styles.formGrid}>
            {/* Basic Information */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your full name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter username"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter email address"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter phone number"
              />
            </div>

            {/* Personal Details */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Fitness Details */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter height in cm"
                min="0"
                max="300"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter weight in kg"
                min="0"
                max="500"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="athlete">Athlete</option>
              </select>
            </div>

            <div style={styles.fullWidth}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fitness Goals</label>
                <textarea
                  name="fitnessGoals"
                  value={formData.fitnessGoals}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Tell us about your fitness goals..."
                />
              </div>
            </div>

            <div style={styles.fullWidth}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                ...(saving ? { cursor: "not-allowed" } : {})
              }}
              className="save-btn"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;