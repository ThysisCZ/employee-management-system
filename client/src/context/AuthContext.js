import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}

// Provider component that wraps the app
export function AuthProvider({ children }) {
    const [manager, setManager] = useState(null);
    const [token, setToken] = useState(null);

    // Login function - stores manager data and token
    const login = (managerData, authToken) => {
        setManager(managerData);
        setToken(authToken);
    };

    // Logout function - clears everything
    const logout = () => {
        setManager(null);
        setToken(null);
    };

    // Check if user is logged in
    const isAuthenticated = () => {
        return token !== null && manager !== null;
    };

    // Value that will be accessible to all components
    const value = {
        manager,
        token,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}