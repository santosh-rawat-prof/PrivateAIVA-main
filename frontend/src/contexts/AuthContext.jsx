import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState("");

    const login = (data) => {
        setUser(data.user);
        setLoggedIn(true);
        setToken(data.token);
    };

    const logout = () => {
        setUser(null);
        setLoggedIn(false);
    };

    const contextValue = {
        user,
        loggedIn,
        login,
        logout,
        token,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
