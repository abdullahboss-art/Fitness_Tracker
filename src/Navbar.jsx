import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);
  // const [resultsHover, setResultsHover] = useState(false);
  const [profileHover,] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const [Logo, setLogo] = useState("/Fitness_logo.png");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AGAR SIGNUP YA LOGIN PAGE HAI TO NAVBAR MAT DIKHAO
  if (location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  // AGAR TOKEN NAHI HAI TO BHI NAVBAR MAT DIKHAO
  if (!token) {
    return null;
  }

  // Get first letter of email for avatar (fallback)
  const getInitial = () => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Navigate to Dashboard
  // Navbar.jsx mein ye line change karo (line number around 60-65)
// Navbar.jsx mein ye line change karo

  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  // BLACK AND ORANGE THEME
  const colors = {
    black: '#0a0a0a',
    darkBlack: '#000000',
    lightBlack: '#1a1a1a',
    orange: '#f97316',
    darkOrange: '#ea580c',
    lightOrange: '#fb923c',
    gray: '#a3a3a3',
    darkGray: '#525252',
    white: '#ffffff'
  };

  const styles = {
    navbar: {
      background: colors.black,
      padding: "12px 30px",
      boxShadow: "0 4px 20px rgba(249,115,22,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: `2px solid ${colors.orange}`,
      backdropFilter: "blur(10px)",
    },
    
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    logoLink: {
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.3s ease",
    },
    logoImage: {
      height: "85px",
      width: "143px",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      transition: "transform 0.3s ease",
    },
    logoText: {
      fontSize: "24px",
      fontWeight: "bold",
      color: colors.white,
      letterSpacing: "1px",
      background: `linear-gradient(135deg, ${colors.orange}, ${colors.lightOrange})`,
      padding: "8px 18px",
      borderRadius: "50px",
      boxShadow: `0 4px 15px ${colors.orange}40`,
    },
    logoEmoji: {
      fontSize: "26px",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
    },
    
    nav: {
      display: "flex",
      gap: "30px",
      alignItems: "center",
      background: colors.lightBlack,
      padding: "8px 20px",
      borderRadius: "50px",
      border: `1px solid ${colors.darkGray}`
    },
    navLink: {
      textDecoration: "none",
      color: colors.gray,
      fontWeight: "600",
      fontSize: "15px",
      padding: "8px 16px",
      borderRadius: "30px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      letterSpacing: "0.3px"
    },
    activeNavLink: {
      background: colors.orange,
      color: colors.black,
      boxShadow: `0 4px 10px ${colors.orange}60`
    },
    navLinkHover: {
      background: `${colors.orange}20`,
      color: colors.orange
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginLeft: "10px"
    },
    profileImage: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
      border: profileHover ? `3px solid ${colors.orange}` : "3px solid transparent",
      transition: "all 0.3s ease",
      boxShadow: profileHover ? `0 0 20px ${colors.orange}` : "none"
    },
    profileCircle: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors.orange}, ${colors.darkOrange})`,
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: profileHover ? `0 0 20px ${colors.orange}` : "none",
      border: profileHover ? `2px solid ${colors.white}` : "2px solid transparent"
    },
    
    resultsBtn: {
      background: "transparent",
      color: colors.orange,
      border: `2px solid ${colors.orange}`,
      borderRadius: "30px",
      padding: "8px 22px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      letterSpacing: "0.5px"
    },
    resultsBtnHover: {
      background: colors.orange,
      color: colors.black,
      boxShadow: `0 4px 15px ${colors.orange}`
    },
    logoutBtn: {
      background: "transparent",
      color: colors.orange,
      border: `2px solid ${colors.orange}`,
      borderRadius: "30px",
      padding: "8px 22px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      letterSpacing: "0.5px"
    },
    logoutBtnHover: {
      background: colors.orange,
      color: colors.black,
      boxShadow: `0 4px 15px ${colors.orange}`
    },
    mobileMenuBtn: {
      display: "flex",
      cursor: "pointer",
      fontSize: "28px",
      color: colors.orange,
      background: colors.lightBlack,
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${colors.darkGray}`
    },
    mobileNav: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "25px",
      background: colors.black,
      position: "absolute",
      top: "80px",
      left: "10px",
      right: "10px",
      borderRadius: "20px",
      boxShadow: `0 10px 30px ${colors.orange}30`,
      border: `1px solid ${colors.darkGray}`,
      backdropFilter: "blur(10px)"
    },
    mobileLink: {
      textDecoration: "none",
      color: colors.gray,
      padding: "14px 18px",
      fontSize: "16px",
      fontWeight: "500",
      borderRadius: "12px",
      background: colors.lightBlack,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "all 0.3s ease",
      border: `1px solid transparent`
    },
    mobileLinkHover: {
      background: `${colors.orange}15`,
      color: colors.orange,
      border: `1px solid ${colors.orange}40`
    },
    mobileProfileSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px",
      background: colors.lightBlack,
      borderRadius: "15px",
      border: `1px solid ${colors.darkGray}`
    },
    mobileProfileImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `2px solid ${colors.orange}`
    },
    
    mobileProfileCircle: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors.orange}, ${colors.darkOrange})`,
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      fontWeight: "700"
    },
    mobileEmail: {
      color: colors.white,
      fontWeight: "600",
      fontSize: "15px"
    },
    mobileResultsBtn: {
      background: "transparent",
      color: colors.orange,
      border: `2px solid ${colors.orange}`,
      borderRadius: "30px",
      padding: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      width: "100%",
      marginTop: "10px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    mobileLogoutBtn: {
      background: "transparent",
      color: colors.orange,
      border: `2px solid ${colors.orange}`,
      borderRadius: "30px",
      padding: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      width: "100%",
      marginTop: "10px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    mobileLogoutBtnHover: {
      background: colors.orange,
      color: colors.black
    },
    mobileResultsBtnHover: {
      background: colors.orange,
      color: colors.black
    }
  };

  // Handle responsive display
  const mobileMenuDisplay = isMobile ? 'flex' : 'none';
  const navDisplay = isMobile ? 'none' : 'flex';

  return (
    <header style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo - Clickable to go to Dashboard */}
        <Link 
          to="/dashboard" 
          style={styles.logoLink}
          onMouseEnter={(e) => {
            if (e.currentTarget.querySelector('img')) {
              e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget.querySelector('img')) {
              e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            }
          }}
        >
          <img 
            src={Logo} 
            alt="Fitness Logo" 
            style={styles.logoImage}
            onError={() => setLogo('/fallback-logo.png')}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav style={{...styles.nav, display: navDisplay}}>
          <Link 
            to="/workout" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 'workout' ? styles.navLinkHover : {}),
              ...(isActive('/workout') ? styles.activeNavLink : {})
            }}
            onMouseEnter={() => setHoveredLink('workout')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Workouts
          </Link>
          
          <Link 
            to="/nutrition" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 'nutrition' ? styles.navLinkHover : {}),
              ...(isActive('/nutrition') ? styles.activeNavLink : {})
            }}
            onMouseEnter={() => setHoveredLink('nutrition')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Nutrition
          </Link>
          
          <Link 
            to="/progress" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 'progress' ? styles.navLinkHover : {}),
              ...(isActive('/progress') ? styles.activeNavLink : {})
            }}
            onMouseEnter={() => setHoveredLink('progress')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Progress
          </Link>
          
          <Link 
            to="/profile" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 'profile' ? styles.navLinkHover : {}),
              ...(isActive('/profile') ? styles.activeNavLink : {})
            }}
            onMouseEnter={() => setHoveredLink('profile')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Profile
          </Link>

          {/* FAQ Link - Added for Desktop */}
          <Link 
            to="/faqs" 
            style={{
              ...styles.navLink,
              ...(hoveredLink === 'faqs' ? styles.navLinkHover : {}),
              ...(isActive('/faqs') ? styles.activeNavLink : {})
            }}
            onMouseEnter={() => setHoveredLink('faqs')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            FAQs
          </Link>

          <div style={styles.profileSection}>
            {/* Results Button */}
            {/* <button 
              onClick={handleResultsClick} 
              style={{
                ...styles.resultsBtn,
                ...(resultsHover ? styles.resultsBtnHover : {})
              }}
              onMouseEnter={() => setResultsHover(true)}
              onMouseLeave={() => setResultsHover(false)}
            >
              <span>📊</span>
              Results
            </button> */}
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              style={{
                ...styles.logoutBtn,
                ...(logoutHover ? styles.logoutBtnHover : {})
              }}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div 
          style={{...styles.mobileMenuBtn, display: mobileMenuDisplay}} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <nav style={styles.mobileNav}>
          <Link to="/profile" style={{textDecoration: 'none'}} onClick={() => setMenuOpen(false)}>
            <div style={styles.mobileProfileSection}>
              {!imageError ? (
                <img 
                  src="/ProfileImages.avif"
                  alt="Profile"
                  style={styles.mobileProfileImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={styles.mobileProfileCircle}>
                  {getInitial()}
                </div>
              )}
              <span style={styles.mobileEmail}>{email}</span>
            </div>
          </Link>

          <Link 
            to="/workout" 
            onClick={() => setMenuOpen(false)} 
            style={styles.mobileLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.mobileLinkHover.background;
              e.currentTarget.style.color = styles.mobileLinkHover.color;
              e.currentTarget.style.border = styles.mobileLinkHover.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.lightBlack;
              e.currentTarget.style.color = colors.gray;
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <span style={{color: colors.orange}}>💪</span> Workouts
          </Link>
          
          <Link 
            to="/nutrition" 
            onClick={() => setMenuOpen(false)} 
            style={styles.mobileLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.mobileLinkHover.background;
              e.currentTarget.style.color = styles.mobileLinkHover.color;
              e.currentTarget.style.border = styles.mobileLinkHover.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.lightBlack;
              e.currentTarget.style.color = colors.gray;
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <span style={{color: colors.orange}}>🥗</span> Nutrition
          </Link>
          
          <Link 
            to="/progress" 
            onClick={() => setMenuOpen(false)} 
            style={styles.mobileLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.mobileLinkHover.background;
              e.currentTarget.style.color = styles.mobileLinkHover.color;
              e.currentTarget.style.border = styles.mobileLinkHover.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.lightBlack;
              e.currentTarget.style.color = colors.gray;
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <span style={{color: colors.orange}}>📊</span> Progress
          </Link>
          
          <Link 
            to="/profile" 
            onClick={() => setMenuOpen(false)} 
            style={styles.mobileLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.mobileLinkHover.background;
              e.currentTarget.style.color = styles.mobileLinkHover.color;
              e.currentTarget.style.border = styles.mobileLinkHover.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.lightBlack;
              e.currentTarget.style.color = colors.gray;
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <span style={{color: colors.orange}}>👤</span> Profile
          </Link>
          
          <Link 
            to="/faqs" 
            onClick={() => setMenuOpen(false)} 
            style={styles.mobileLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.mobileLinkHover.background;
              e.currentTarget.style.color = styles.mobileLinkHover.color;
              e.currentTarget.style.border = styles.mobileLinkHover.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.lightBlack;
              e.currentTarget.style.color = colors.gray;
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <span style={{color: colors.orange}}>❓</span> FAQs
          </Link>
          
          {/* Mobile Results Button */}
          {/* <button 
            onClick={() => {
              handleResultsClick();
              setMenuOpen(false);
            }} 
            style={styles.mobileResultsBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.orange;
              e.currentTarget.style.color = colors.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.orange;
            }}
          >
            📊 Results
          </button> */}
          
          {/* Mobile Logout Button */}
          <button 
            onClick={handleLogout} 
            style={styles.mobileLogoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.orange;
              e.currentTarget.style.color = colors.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.orange;
            }}
          >
            🚪 Logout
          </button>
        </nav>
      )}
    </header>
  );
}

export default Navbar;