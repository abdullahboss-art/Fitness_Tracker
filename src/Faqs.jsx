// pages/FAQ.jsx
import React, { useState } from 'react';
import './Faqs.css';

function FAQ() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqs = [
    {
      id: 1,
      category: "getting_started",
      question: "How do I start tracking my workouts?",
      answer: "Getting started with workout tracking is easy! Simply navigate to the Workout Tracking page, click the 'Add Workout' button, and fill in your exercise details. You can choose from various exercises, set duration, intensity, and add notes. Your workouts will be saved and appear in your workout history. You can also view your progress over time in the Progress Analytics section."
    },
    {
      id: 2,
      category: "nutrition",
      question: "How do I log my meals and track calories?",
      answer: "To log your meals, go to the Nutrition Logging page. You can search our extensive food database for any item, or add custom foods. Simply enter the portion size, and we'll automatically calculate the calories, protein, carbs, and fats. You can log breakfast, lunch, dinner, and snacks throughout the day. Your daily nutrition summary will help you stay on track with your fitness goals."
    },
    {
      id: 3,
      category: "progress",
      question: "How can I view my fitness progress?",
      answer: "Visit the Progress Analytics page to see detailed charts and graphs of your fitness journey. You can track weight trends, workout frequency, strength improvements, and calorie intake over days, weeks, or months. Our analytics help you identify patterns and celebrate your achievements. You can also export your progress data for sharing with your trainer or doctor."
    },
    {
      id: 4,
      category: "account",
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Click the link in your email, create a new password, and you'll be able to log in immediately. For security reasons, make sure to choose a strong password with at least 8 characters including numbers and special symbols."
    },
    {
      id: 5,
      category: "workout",
      question: "Can I create custom workout routines?",
      answer: "Absolutely! FitTrack allows you to create personalized workout routines. Go to the Workout Tracking page and click 'Create Routine'. You can add multiple exercises, set sets, reps, and rest periods. Save your routines for quick access, and track your performance each time you complete them. You can also share your routines with the FitTrack community!"
    },
    {
      id: 6,
      category: "nutrition",
      question: "What if my food isn't in the database?",
      answer: "No problem! You can add custom foods to our database. Simply click 'Add Custom Food' in the Nutrition Logging page, enter the food name, serving size, and nutritional information (calories, protein, carbs, fats). Your custom foods will be saved for future use. You can also scan barcodes for quick entry of packaged foods."
    },
    {
      id: 7,
      category: "progress",
      question: "How accurate are the progress analytics?",
      answer: "Our progress analytics are highly accurate when you consistently log your data. The system uses advanced algorithms to calculate trends, moving averages, and meaningful insights from your input. For best results, we recommend logging workouts and nutrition daily. The more consistent you are with tracking, the more accurate and valuable your analytics will become."
    },
    {
      id: 8,
      category: "account",
      question: "Is my data secure and private?",
      answer: "Yes! We take your privacy seriously. All your data is encrypted using industry-standard SSL technology. We never share your personal information with third parties without your consent. You have full control over your data and can export or delete it at any time. For more details, please review our Privacy Policy and Terms of Service."
    },
    {
      id: 9,
      category: "getting_started",
      question: "How do I set my fitness goals?",
      answer: "Setting goals is easy! Go to your Profile Settings and click on 'Fitness Goals'. You can set goals like weight loss, muscle gain, endurance improvement, or maintenance. Enter your target weight, desired workout frequency, or calorie targets. The app will then personalize your dashboard and provide tailored recommendations to help you achieve your goals."
    },
    {
      id: 10,
      category: "workout",
      question: "Can I sync with fitness devices?",
      answer: "Yes! FitTrack integrates with popular fitness devices and apps including Apple Health, Google Fit, Fitbit, and Garmin. Go to Settings > Connected Devices to link your accounts. Once connected, your workouts, steps, and heart rate data will automatically sync, giving you a complete picture of your fitness journey."
    }
  ];

  const categories = [
    { id: "all", name: "All Questions",  },
    { id: "getting_started", name: "Getting Started", },
    { id: "workout", name: "Workouts",  },
    { id: "nutrition", name: "Nutrition", },
    { id: "progress", name: "Progress",  },
    { id: "account", name: "Account",  }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm] = useState("");

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === "all" || faq.category === selectedCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1> Frequently Asked Questions</h1>
        <p>Find answers to common questions about FitTrack</p>
      </div>

     

      {/* Categories */}
      <div className="categories-container">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="faq-list">
        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No questions found</h3>
            <p>Try different keywords or browse categories</p>
          </div>
        ) : (
          filteredFaqs.map(faq => (
            <div key={faq.id} className="faq-item">
              <button 
                className={`faq-question ${openItems.includes(faq.id) ? 'open' : ''}`}
                onClick={() => toggleItem(faq.id)}
              >
                <div className="question-text">
                  <span className="question-icon">
                    {faq.category === "getting_started" }
                    {faq.category === "workout" }
                    {faq.category === "nutrition" }
                    {faq.category === "progress" }
                    {faq.category === "account" }
                  </span>
                  {faq.question}
                </div>
                <span className="toggle-icon">
                  {openItems.includes(faq.id) ? '−' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${openItems.includes(faq.id) ? 'show' : ''}`}>
                <div className="answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Need Help Section */}
   
    </div>
  );
}

export default FAQ;