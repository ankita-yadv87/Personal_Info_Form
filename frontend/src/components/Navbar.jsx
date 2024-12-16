import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import useAuthToken from "../custom_hook/useAuthToken"
import apiService from "../services/apiService";

const Navbar = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authToken = useAuthToken();
  const navigate = useNavigate();
  const isLoggedIn = !!authToken;

  const handleLogout = async () => {
    try {
      const response = await apiService.logoutUser();
     
      if (response?.success === true) {
        alert("Logged out successfully!");
        Cookies.remove("token");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    } catch (error) {
     
      alert(error.response?.data?.message || "Error Logging Out User");
      navigate("/login");
    }
    // Cookies.remove("authToken");
    // navigate('/login');
    // alert("Logged out successfully!");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">MyApp</Link>
      <ul className="nav-links">
        {/* <li><Link to="/login">Login</Link></li> */}
        <li><Link to="/register">Register</Link></li>
        {isLoggedIn &&
          (
            <>
              <li><Link to="/my-profile">My Profile</Link></li>
              <li><Link to="/all-users">All Users</Link></li>
            </>

          )}

      </ul>
      <div className="user-actions">
        {isLoggedIn ? (
          <>
            <span className="user-name">Hello, User</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : <Link to="/login" className="login-btn">Login</Link>}
      </div>
    </div>
  );
};

export default Navbar;
