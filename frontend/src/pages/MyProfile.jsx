import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";
import apiService from "../services/apiService";
import Cookies from "js-cookie";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (confirmDelete) {
      try {
        const res = await apiService.deleteUser(userData?._id);
        if (res.success === true) {
          localStorage.removeItem("userData");
          Cookies.remove("token");
          alert("Profile deleted successfully!");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      }
    }
  };

  return (
    <div className="user-profile">
      <h2>{userData.firstName}  {userData.lastName}</h2>
      <div className="header-container">
      <div className="profile-header">
          <div className="profile-image">
            <img src={userData.profilePicture.url || "default-profile.png"} alt="Profile" />
          </div>
        </div>


      <div className="profile-info">
        <div className="profile-field">
          <label>First Name:</label>
          <span>{userData.firstName}</span>
        </div>
        <div className="profile-field">
          <label>Last Name:</label>
          <span>{userData.lastName}</span>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{userData.email}</span>
        </div>
        <div className="profile-field">
          <label>Gender:</label>
          <span>{userData.gender}</span>
        </div>
        <div className="profile-field">
          <label>City:</label>
          <span>{userData.city}</span>
        </div>
        <div className="profile-field">
          <label>State:</label>
          <span>{userData.state}</span>
        </div>
        <div className="profile-field">
          <label>Country:</label>
          <span>{userData.country}</span>
        </div>
        <div className="profile-field">
          <label>Zip Code:</label>
          <span>{userData.zip}</span>
        </div>
        <div className="profile-field">
          <label>Area of Interest:</label>
          <span>{userData.areaOfInterest.join(", ")}</span>
        </div>
        {/* <div className="profile-field">
          <label>Profile Picture:</label>
          <span>{userData.profilePicture ? <img src={userData.profilePicture} alt="Profile" /> : "No profile picture"}</span>
        </div> */}
        <div className="profile-field">
          <label>Account Created At:</label>
          <span>{new Date(userData.createdAt).toLocaleString()}</span>
        </div>
        <div className="profile-field">
          <label>Last Updated At:</label>
          <span>{new Date(userData.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      </div>
    
      

      <div className="buttons">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleDeleteProfile} className="delete-button">Delete Profile</button>
      </div>
    </div>
  );
};

export default MyProfile;
