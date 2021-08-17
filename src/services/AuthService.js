import axios from "axios";
import authHeader from './AuthHeader';

const API_URL = process.env.REACT_APP_API_URL;

const AuthService = {
    async login(credentials) {
        // Remove any current login tokens
        localStorage.removeItem("token");
        const postData = {
            email: credentials.username,
            password: credentials.password
        }
        try {
            const response = await axios.post(API_URL + "/auth/login", postData)
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                return response.data
            }
            else return {
                "errorCode": "UNKNOWN_ERROR",
                "errorMessage": "There was an unknown error."
            };
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.errorCode) {
                return error.response.data;
            }
            else return {
                "errorCode": "UNKNOWN_ERROR",
                "errorMessage": "There was an unknown error."
            };
        }
    },
    async requestPasswordReset(email) {
        // Remove any current login tokens
        localStorage.removeItem("token");
        const postData = {
            email: email
        }
        try {
            await axios.post(API_URL + "/auth/forgot-password", postData)
            return { "message": "You will receive an email with your password reset code." }
        }
        catch (error) {
            if (error.response && error.response.data) {
                return error.response.data;
            }
            else return {
                "errorCode": "UNKNOWN_ERROR",
                "errorMessage": "There was an unknown error."
            };
        }
    },
    async resetPassword(credentials) {
        // Remove any current login tokens
        localStorage.removeItem("token");
        const postData = {
            email: credentials.email,
            newPassword: credentials.newPassword,
            resetToken: credentials.resetToken
        }
        try {
            await axios.post(API_URL + "/auth/reset-password", postData)
            return { "message": "Password successfully reset! Please log in with your new credentials." }
        }
        catch (error) {
            if (error.response && error.response.data) {
                return error.response.data;
            }
            else return {
                "errorCode": "UNKNOWN_ERROR",
                "errorMessage": "There was an unknown error."
            };
        }
    },

    logout() {
        localStorage.removeItem("token");
    },

    getUser() {
        const userData = localStorage.getItem("user");
        if (userData) return JSON.parse(userData);
        return {};
    },

    async checkAuth() {
        try {
            const response = await axios.get(API_URL + "/users/me", { headers: authHeader() });
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) return error.response.data;
            else return {
                "errorCode": "UNKNOWN_ERROR",
                "errorMessage": "There was an unknown error."
            };
        };
    }
}

export default AuthService;
