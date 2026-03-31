import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [hover, setHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/User/login", formData);

      // Save token & email
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      if (res.data.profile) localStorage.setItem("profile", res.data.profile);

      alert("Login successful!");
      navigate("/Workout"); // ✅ Go to Dashboard
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Login failed");
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
      maxWidth: "420px",
      width: "100%",
      margin: "0 auto",
      padding: "40px",
      borderRadius: "24px",
      background: "#111111", // Light black
      boxShadow: "0 15px 35px rgba(249, 115, 22, 0.15)",
      border: "1px solid #333333",
      animation: "fadeIn 0.5s ease"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#f97316", // Orange
      margin: "0 0 10px 0",
      textShadow: "0 0 20px rgba(249, 115, 22, 0.3)",
      letterSpacing: "-0.5px"
    },
    subtitle: {
      fontSize: "14px",
      color: "#a3a3a3",
      margin: 0,
      fontWeight: "400"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "14px",
      color: "#f97316", // Orange
      fontWeight: "500",
      marginLeft: "5px",
      transition: "all 0.3s ease"
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "12px",
      border: "2px solid #333333",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      transition: "all 0.3s ease",
      fontFamily: "'Poppins', sans-serif",
      boxSizing: "border-box"
    },
    inputFocus: {
      borderColor: "#f97316",
      boxShadow: "0 0 0 4px rgba(249, 115, 22, 0.1)",
      backgroundColor: "#222222"
    },
    button: {
      width: "100%",
      padding: "16px",
      marginTop: "10px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
      color: "#000000", // Black text
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 20px rgba(249, 115, 22, 0.3)",
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: "0.5px"
    },
    buttonHover: {
      background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 25px rgba(249, 115, 22, 0.4)"
    },
    linkContainer: {
      textAlign: "center",
      marginTop: "25px"
    },
    link: {
      color: "#a3a3a3",
      textDecoration: "none",
      fontSize: "14px",
      transition: "all 0.3s ease",
      display: "inline-block",
      padding: "8px 20px",
      borderRadius: "30px",
      fontWeight: "500"
    },
    linkHover: {
      color: "#f97316", // Orange
      backgroundColor: "rgba(249, 115, 22, 0.1)"
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      margin: "25px 0 15px",
      color: "#333333"
    },
    dividerLine: {
      flex: 1,
      height: "2px",
      background: "linear-gradient(90deg, transparent, #f97316, transparent)"
    },
    dividerText: {
      fontSize: "12px",
      color: "#a3a3a3",
      fontWeight: "500"
    },
    forgotPassword: {
      textAlign: "right",
      marginTop: "-5px"
    },
    forgotLink: {
      color: "#a3a3a3",
      textDecoration: "none",
      fontSize: "12px",
      transition: "color 0.3s ease"
    },
    icon: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#f97316",
      fontSize: "18px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(emailFocus ? styles.inputFocus : {})
                }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              {emailFocus && <span style={styles.icon}>📧</span>}
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(passwordFocus ? styles.inputFocus : {})
                }}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              {passwordFocus && <span style={styles.icon}>🔒</span>}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hover ? styles.buttonHover : {})
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>New to FitTrack?</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Sign Up Link */}
        <div style={styles.linkContainer}>
          <Link 
            to="/signup" 
            style={{
              ...styles.link,
              ...(linkHover ? styles.linkHover : {})
            }}
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
          >
            Create your account → 
          </Link>
        </div>
      </div>

      {/* Global Styles */}
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

          @keyframes glow {
            0% {
              box-shadow: 0 0 5px rgba(249, 115, 22, 0.3);
            }
            50% {
              box-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
            }
            100% {
              box-shadow: 0 0 5px rgba(249, 115, 22, 0.3);
            }
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #1a1a1a inset !important;
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #f97316;
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

export default Login;