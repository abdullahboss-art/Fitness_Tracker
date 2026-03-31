import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

  const [hover, setHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("username", formData.username);
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      if (formData.profilePic) dataToSend.append("profilePic", formData.profilePic);

      const res = await axios.post(
        "http://localhost:3000/User/register",
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(res.data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // Black & Orange Theme Styles
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a", // Pure black background
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px"
    },
    formContainer: {
      maxWidth: "450px",
      width: "100%",
      margin: "0 auto",
      padding: "40px",
      borderRadius: "20px",
      background: "#111111", // Light black
      boxShadow: "0 10px 30px rgba(249, 115, 22, 0.15)",
      border: "1px solid #333333",
      animation: "fadeIn 0.5s ease"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#f97316", // Orange
      margin: "0 0 10px 0",
      textShadow: "0 0 15px rgba(249, 115, 22, 0.3)"
    },
    subtitle: {
      fontSize: "14px",
      color: "#a3a3a3",
      margin: 0
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px"
    },
    label: {
      fontSize: "14px",
      color: "#f97316", // Orange
      fontWeight: "500",
      marginLeft: "5px"
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid #333333",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      transition: "all 0.3s ease",
      fontFamily: "'Poppins', sans-serif",
      boxSizing: "border-box"
    },
    fileInput: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid #333333",
      fontSize: "14px",
      backgroundColor: "#1a1a1a",
      color: "#a3a3a3",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Poppins', sans-serif"
    },
    button: {
      width: "100%",
      padding: "14px",
      marginTop: "10px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#f97316", // Orange
      color: "#000000", // Black text
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
      fontFamily: "'Poppins', sans-serif"
    },
    buttonHover: {
      backgroundColor: "#ea580c", // Darker orange
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(249, 115, 22, 0.4)"
    },
    linkContainer: {
      textAlign: "center",
      marginTop: "20px"
    },
    link: {
      color: "#a3a3a3",
      textDecoration: "none",
      fontSize: "14px",
      transition: "all 0.3s ease",
      display: "inline-block",
      padding: "8px 16px",
      borderRadius: "6px"
    },
    linkHover: {
      color: "#f97316", // Orange
      backgroundColor: "rgba(249, 115, 22, 0.1)"
    },
    errorText: {
      color: "#ef4444",
      fontSize: "12px",
      marginTop: "5px"
    },
    successText: {
      color: "#10b981",
      fontSize: "12px",
      marginTop: "5px"
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "20px 0",
      color: "#333333"
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#333333"
    },
    dividerText: {
      fontSize: "12px",
      color: "#a3a3a3"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Join FitTrack</h1>
          <p style={styles.subtitle}>Create your account to start your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
          {/* Username */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#f97316"}
              onBlur={(e) => e.target.style.borderColor = "#333333"}
            />
          </div>

          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#f97316"}
              onBlur={(e) => e.target.style.borderColor = "#333333"}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#f97316"}
              onBlur={(e) => e.target.style.borderColor = "#333333"}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#f97316"}
              onBlur={(e) => e.target.style.borderColor = "#333333"}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#f97316"}
              onBlur={(e) => e.target.style.borderColor = "#333333"}
            />
          </div>

          {/* Profile Picture */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Profile Picture (Optional)</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              style={styles.fileInput}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hover ? styles.buttonHover : {})
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Login Link */}
        <div style={styles.linkContainer}>
          <Link 
            to="/login" 
            style={{
              ...styles.link,
              ...(linkHover ? styles.linkHover : {})
            }}
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>

      {/* Add global styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: #0a0a0a;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #1a1a1a inset !important;
            -webkit-text-fill-color: #ffffff !important;
          }

          input[type="file"]::-webkit-file-upload-button {
            background: #f97316;
            color: #000000;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s ease;
          }

          input[type="file"]::-webkit-file-upload-button:hover {
            background: #ea580c;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
          }

          /* Custom scrollbar */
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
        `}
      </style>
    </div>
  );
};

export default Signup;