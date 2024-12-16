import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); 

  const handleGoToProfile = () => {
    navigate('/my-profile'); 
  };

  return (
    <div className="home-container">
      <h1>Welcome to Our Website</h1>
      <p>Your journey to discovering something amazing starts here.</p>
      <button className="cta-button" onClick={handleGoToProfile}>
        Go to My Profile
      </button>
    </div>
  );
};

export default Home;
