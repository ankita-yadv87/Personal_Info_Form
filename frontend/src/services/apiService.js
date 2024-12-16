import API from "./api";
import axios from "axios";

const apiService = {
    registerUser: async (formData) => {

        try {
            const response = await API.post("/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            console.error('Register Error:', error.response.data.message);
            throw error;
        }
    },


    loginUser: async ({ email, password }) => {
        try {
            const response = await API.post("/login", {
                email: email,
                password: password,
            },)

            return response.data;
        } catch (error) {
            console.error('Login Error:', error.message);
            throw error;
        }

    },

    logoutUser: async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/logout", {
                withCredentials: true,  // Send cookies along with the request
            });
            return response.data;
        } catch (error) {
            console.error('Login Error:', error.message);
            throw error;
        }

    },
    updateUser: async (id,formData) => {
       
        try {
            const response = await API.put(`/update/${id}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
            )

            return response.data;
        } catch (error) {
            console.error('Login Error:', error.message);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await API.delete(`/delete/${id}`)
            return response.data;

        } catch (error) {
            console.error('Login Error:', error.message);
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const response = await API.get(`/all-users`)
            return response.data;

        } catch (error) {
            throw error;
        }
    },

    getSingleUser: async (id) => {
        try {
            const response = await API.get(`/user/${id}`)
            return response.data;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    forgotPassword: (email) => API.post("/password/forgot", { email }),
    resetPassword: (token, data) => API.put(`/password/reset/${token}`, data),
}

export default apiService;
