import React, { useState } from "react";
import FormInput from "../components/FormInput";
import apiService from "../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css"; // Add a CSS file for styling

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field being edited
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLogin(true);
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set validation errors
            setIsLogin(false);
            return; // Stop further execution
        }

        try {
            const response = await apiService.loginUser(formData);
            setFormData({ email: "", password: "" });
            setIsLogin(false);
            if (response?.success === true) {
                
                alert("User Logged in successfully!");
                Cookies.set("token", response.token, { expires: 7 });
                localStorage.setItem("userData", JSON.stringify(response.user));
                navigate('/home');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Error Logging in User");
            setFormData({ email: "", password: "" });
        }
        setIsLogin(false);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <button
                    className="login-btn"
                    disabled={isLogin}
                    type="submit"
                >
                    {!isLogin ? "Login" : "Logging in..."}
                </button>

                <div className="register-link">
                    <span>Don't have an account? <Link to="/register">Register here</Link></span>
                </div>
            </form>
        </div>
    );
};

export default Login;
