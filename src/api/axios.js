import axios from "axios";

export const getUserToken = () => localStorage.getItem("userDetails")
? JSON.parse(localStorage.getItem("userDetails")).token : ""

export const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

export const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthorizationHeader()
    }
});

export const axiosOpen = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': getAuthorizationHeader()
    },
});

export const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_REACT_APP_API_URL });

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.userDetails ? JSON.parse(localStorage.userDetails).token : null;
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
