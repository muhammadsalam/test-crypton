import { useUserStore } from "@/entities/user";
import axios from "axios";
import { useNavigate } from "react-router";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BACK,
})

http.interceptors.request.use(config => {
    const { token } = useUserStore.getState(); // Получаем текущий токен из Zustand
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


http.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        const navigate = useNavigate();
        useUserStore.setState({ token: '' });
        localStorage.removeItem('token');
        navigate("/login");
        // Optionally, you can handle the unauthorized case here, e.g., redirect to login
    }
    return Promise.reject(error);
});