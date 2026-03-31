import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import Workouts from "./Workout";
import Nutrition from "./Nutrition";
import Progress from "./Progress";
import EditProfile from "./EditProfile";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FAQ from "./Faqs";
// import DashboardPage from "./DashboardPage"; // Fixed the import path
// import DashboardWorkout from "./WorkoutsPage"; // Fixed the import path

function App() {
  return (

      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        } />
        
        <Route path="/workout" element={
          <>
            <Navbar />
            <Workouts />
            <Footer />
          </>
        } />
        
        <Route path="/nutrition" element={
          <>
            <Navbar />
            <Nutrition />
            <Footer />
          </>
        } />
        
        <Route path="/progress" element={
          <>
            <Navbar />
            <Progress />
            <Footer />
          </>
        } />
        
        <Route path="/faqs" element={
          <>
            <Navbar />
            <FAQ />
            <Footer />
          </>
        } />
        
        <Route path="/editprofile" element={
          <>
            <Navbar />
            <EditProfile />
            <Footer />
          </>
        } />
        
        {/* <Route path="/dashboard" element={
          <>
            <Navbar />
            <DashboardPage />
            <Footer />
          </>
        } /> */}
        
       
        
     
      </Routes>
    
  );
}

export default App;