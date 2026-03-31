import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const [Logo] = useState("/Fitness_logo.png");
  const [logoError, setLogoError] = useState(false);

  const styles = {
    logoLink: {
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    logoImage: {
      height: "45px",
      width: "auto",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      transition: "transform 0.3s ease",
    },
    logoText: {
      fontSize: "24px",
      fontWeight: "bold",
      background: "linear-gradient(135deg, #f97316, #fb923c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="brand-section">
          <Link 
            to="/dashboard" 
            style={styles.logoLink}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            {!logoError ? (
              <img className="img"
                src={Logo} 
                alt="Fitness Logo" 
                style={styles.logoImage}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span style={styles.logoText}>FitTrack</span>
            )}
          </Link>
          
          <p className="brand-description">
            Your ultimate fitness companion for tracking workouts, nutrition, and progress. 
            Transform your fitness journey with personalized insights and analytics.
          </p>
          
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              🐦
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              📸
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              ▶️
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              💻
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="footer-section">
          <h3>✨ Features</h3>
          <ul>
            <li>
              <Link to="/workout">
                <span className="link-icon">🏃</span>
                Workout Tracking
              </Link>
            </li>
            <li>
              <Link to="/nutrition">
                <span className="link-icon">🥗</span>
                Nutrition Logging
              </Link>
            </li>
            <li>
              <Link to="/progress">
                <span className="link-icon">📈</span>
                Progress Analytics
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-section">
          <h3>👤 Account</h3>
          <ul>
            <li>
              <Link to="/profile">
                <span className="link-icon">👤</span>
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/faqs">
                <span className="link-icon">❓</span>
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact-section">
          <h3>📞 Contact Us</h3>
          <ul className="contact-info">
            <li>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </div>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:support@fittrack.com">support@fittrack.com</a>
                </div>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <div className="contact-details">
                  <span className="contact-label">Business Hours</span>
                  <span>Mon-Fri: 9AM - 6PM</span>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} FitTrack | Built with ❤️ by Abdullah Musharraf 💪
        </p>
      </div>
    </footer>
  );
}

export default Footer;