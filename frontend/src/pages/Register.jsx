import React, { useState } from "react";
import apiService from "../services/apiService";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  RegionSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    stateid: null,
    zip: "",
    country: "",
    countryid: null,
    region: "",
    areaOfInterest: [],
    profilePicture: null,
  });
  const default_url = "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"

  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(default_url); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "areaOfInterest") {
      const updatedInterests = formData.areaOfInterest.includes(value)
        ? formData.areaOfInterest.filter((item) => item !== value)
        : [...formData.areaOfInterest, value];
      setFormData({ ...formData, areaOfInterest: updatedInterests });
    } else if (name === "profilePicture") {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setFormData({ ...formData, profilePicture: file});
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.profilePicture) newErrors.state = "Please select a file to upload.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegister(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsRegister(false);
      return;
    }

    const newFormData = new FormData();
    newFormData.append("firstName", formData?.firstName);
    newFormData.append("lastName", formData?.lastName);
    newFormData.append("gender", formData?.gender);
    newFormData.append("email", formData?.email);
    newFormData.append("password", formData?.password);
    newFormData.append("city", formData?.city);
    newFormData.append("state", formData?.state);
    newFormData.append("zip", formData?.zip);
    newFormData.append("country", formData?.country);
    newFormData.append("areaOfInterest", JSON.stringify(formData?.areaOfInterest));
    newFormData.append("profilePicture", formData?.profilePicture);

    console.log("NewFormData",newFormData)
    try {
      const response = await apiService.registerUser(newFormData);
      if (response?.success === true) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error registering User");
    }
    setIsRegister(false);
  };
  
  
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

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
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            required={true}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error-text">{errors.firstName}</span>
          )}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            required={true}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span className="error-text">{errors.lastName}</span>
          )}
        </div>
        <div>
          <label>Gender</label>
          <div className="gender-container">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />{" "}
            Male
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />{" "}
            Female
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={formData.gender === "Other"}
              onChange={handleChange}
            />{" "}
            Other
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>
        {/* <div className="form-group">
          <label>Region</label>
          <RegionSelect
            onChange={(e) => setFormData({ ...formData, region: e.name })}
            placeHolder="Select Region"
          />
        </div> */}
        <div className="form-group">
          <label>Country</label>
          <CountrySelect
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
            countryid={formData?.countryid ?? null} // Ensure countryid is passed
            stateid={formData?.stateid ?? null} // Ensure stateid is passed
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.name,
              })
            }
            placeHolder="Select City"
          />
        </div>

        <div className="form-group">
          <label>Zip</label>
          <input
            type="text"
            name="zip"
            value={formData?.zip}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Area of Interest</label>
          <div className="area-of-interest">
            <label>
              <input
                type="checkbox"
                name="areaOfInterest"
                value="Reading"
                onChange={handleChange}
              />{" "}
              Reading
            </label>
            <label>
              <input
                type="checkbox"
                name="areaOfInterest"
                value="Writing"
                onChange={handleChange}
              />{" "}
              Writing
            </label>
            <label>
              <input
                type="checkbox"
                name="areaOfInterest"
                value="Traveling"
                onChange={handleChange}
              />{" "}
              Traveling
            </label>
            <label>
              <input
                type="checkbox"
                name="areaOfInterest"
                value="Playing"
                onChange={handleChange}
              />{" "}
              Playing
            </label>
          </div>
        </div>
        {/* <div>
          <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" required />
         
        </div> */}
        {/* <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </div> */}
        <button type="submit" disabled={isRegister} className="register-btn">{!isRegister ? "Register" : " Registering.."}
        </button>
      </form>
    </div>
  );
};

export default Register;
