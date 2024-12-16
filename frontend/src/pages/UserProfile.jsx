import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";
import apiService from "../services/apiService"; // Make sure apiService is updated to fetch user details by ID

const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getSingleUser(id); 
        setUserData(data?.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to load user details");
        navigate("/users"); // Navigate back to the users list on error
      }
    };

    fetchUser();
  }, [id, navigate]); // Re-fetch when the ID changes

  if (!userData) {
    return <div>Loading...</div>;
  }

//   const handleUpdateProfile = () => {
//     navigate("/update-profile");
//   };

//   const handleDeleteProfile = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
//     if (confirmDelete) {
//       try {
//         const res = await apiService.deleteUser(userData?._id); // Ensure your API has a delete method
//         if (res.success === true) {
//           alert("Profile deleted successfully!");
//           navigate("/users"); // Redirect to the users list after deletion
//         }
//       } catch (error) {
//         console.error("Error deleting profile:", error);
//         alert("Error deleting profile");
//       }
//     }
//   };

  return (
    <div className="user-profile">
      <h2>{userData.firstName} {userData.lastName}</h2>
      <div className="header-container">
        <div className="profile-header">
          <div className="profile-image">
            <img src={userData.profilePicture?.url || "default-profile.png"} alt="Profile" />
          </div>
        </div>
        <div className="profile-info">
          {/* Render all user fields */}
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
            <span>{userData?.areaOfInterest?.join(", ")}</span>
          </div>
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
     {/* <div className="buttons">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleDeleteProfile} className="delete-button">Delete Profile</button>
      </div>*/}
    </div>
  );
};

export default UserProfile;
