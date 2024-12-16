import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    city: "",
    state: "",
    stateid: null,
    zip: "",
    country: "",
    countryid: null,
    areaOfInterest: [],
    profilePicture: "",
    profile_public_id:""
  });
  const [profileImage, setProfileImage] = useState(null); 
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const default_url = "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        gender: userData.gender || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
        country: userData.country || "",
        areaOfInterest: userData.areaOfInterest || [],
        profilePicture: userData.profilePicture?.url || "",
        profile_public_id:userData.profilePicture?.public_id || "",
        userId: userData._id,
      });
      setProfileImage(userData.profilePicture?.url || "")
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "areaOfInterest") {
      const updatedInterests = formData.areaOfInterest.includes(value)
        ? formData.areaOfInterest.filter((item) => item !== value)
        : [...formData.areaOfInterest, value];
      setFormData({ ...formData, areaOfInterest: updatedInterests });
    }else if (name === "profilePicture") {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setFormData({ ...formData, profilePicture: file });
    }  else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true)
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newFormData = new FormData();
    newFormData.append("firstName", formData?.firstName);
    newFormData.append("lastName", formData?.lastName);
    newFormData.append("gender", formData?.gender);
    newFormData.append("city", formData?.city);
    newFormData.append("state", formData?.state);
    newFormData.append("zip", formData?.zip);
    newFormData.append("country", formData?.country);
    newFormData.append("areaOfInterest", JSON.stringify(formData?.areaOfInterest));
    newFormData.append("profilePicture", formData?.profilePicture);
    // if (profileImage) newFormData.append("profilePicture", profileImage);
    newFormData.append("profile_public_id",formData?.profile_public_id)

    console.log("UPDate profile",newFormData,"formdata",formData)
    try {
      const response = await apiService.updateUser(formData?.userId, newFormData);
      if (response.success) {
        localStorage.setItem("userData", JSON.stringify(response.user));
        alert("Profile updated successfully!");
        navigate("/my-profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Error Updating User");
    }
    setIsUpdating(false)
  };

  return (
    <div className="update-profile-container">
     

      <form onSubmit={handleSubmit} className="update-profile-form">
        <h2>Update Profile</h2>

        <div className="profile-image-section">
        <label htmlFor="profilePictureInput">
          <img
            src={profileImage || default_url}
            alt="Profile"
            className="profile-picture"
          />
        </label>
        <input
          type="file"
          name="profilePicture"
          id="profilePictureInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleChange}
        /> 
      </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Gender</label>
          <div className="gender-input">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleChange}
          /> Male
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleChange}
          /> Female
          <input
            type="radio"
            name="gender"
            value="Other"
            checked={formData.gender === "Other"}
            onChange={handleChange}
          /> Other
          </div>
          
        </div>

        <div className="form-group">
          <label>Country</label>
          <CountrySelect
            value={formData?.country ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                country: e.name,
                countryid: e.id,
                state: "",
                stateid: null,
                city: "",
              })
            }
            placeHolder="Select Country"
          />
          {errors?.country && <span className="error-text">{errors?.country}</span>}
        </div>

        <div className="form-group">
          <label>State</label>
          <StateSelect
            key={formData?.countryid}
            countryid={formData?.countryid ?? null}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: e.name,
                stateid: e.id,
                city: "",
              })
            }
            placeHolder="Select State"
          />
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label>City</label>
          <CitySelect
            key={formData?.stateid}
            countryid={formData?.countryid ?? null}
            stateid={formData?.stateid ?? null}
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.name,
              })
            }
            placeHolder="Select City"
          />
        </div>

        <div>
          <label>Zip</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Area of Interest</label>
          <input
            type="checkbox"
            name="areaOfInterest"
            value="Reading"
            checked={formData.areaOfInterest.includes("Reading")}
            onChange={handleChange}
          /> Reading
          <input
            type="checkbox"
            name="areaOfInterest"
            value="Writing"
            checked={formData.areaOfInterest.includes("Writing")}
            onChange={handleChange}
          /> Writing
          <input
            type="checkbox"
            name="areaOfInterest"
            value="Traveling"
            checked={formData.areaOfInterest.includes("Traveling")}
            onChange={handleChange}
          /> Traveling
          <input
            type="checkbox"
            name="areaOfInterest"
            value="Playing"
            checked={formData.areaOfInterest.includes("Playing")}
            onChange={handleChange}
          /> Playing
        </div>

        <button type="submit" disabled={isUpdating}>{!isUpdating ? "Update Profile" : "Updating"}</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
