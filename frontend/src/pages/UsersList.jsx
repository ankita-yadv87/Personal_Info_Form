import React, { useState, useEffect } from 'react';
import './UsersList.css';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiService.getAllUsers(); // Replace with your API endpoint
                if (response?.success === true) {
                    // const data = await response.json();
                    setUsers(response.users);
                }
            } catch (error) {
                alert(error.response?.data?.message || "Error Loading User");
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/user/${id}`);
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="users-container">
            {users.map(user => (
                <div className="user-card" key={user._id}>
                    <img
                        src={user.profilePicture?.url}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="profile-picture"
                        onClick={() => handleCardClick(user._id)}
                    />
                    <div className="user-details">
                        <h2>{`${user.firstName} ${user.lastName}`}</h2>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>City:</strong> {user.city}</p>
                        <p><strong>State:</strong> {user.state}</p>
                        <p><strong>Country:</strong> {user.country}</p>
                        <p><strong>ZIP:</strong> {user.zip}</p>
                        <p><strong>Interests:</strong> {user.areaOfInterest.join(', ')}</p>
                        <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UsersList;
