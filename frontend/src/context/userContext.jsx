import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Browser sends HttpOnly token cookie automatically with withCredentials: true
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                // User is unauthenticated / guest
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        if (userData?.token) {
            localStorage.setItem("token", userData.token);
        }
        setLoading(false);
    };

    const clearUser = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        } catch {
            // Silently ignore logout network errors
        } finally {
            setUser(null);
            localStorage.removeItem("token");
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;