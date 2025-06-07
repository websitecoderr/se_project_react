import React, { createContext, useState, useEffect } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

  useEffect(() => {
    console.log("🔄 Checking localStorage for JWT token...");
    const token = localStorage.getItem("jwt"); 

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("✅ Decoded User Data:", payload);
        updateCurrentUser(payload);
      } catch (error) {
        console.error("❌ Error decoding JWT:", error);
        localStorage.removeItem("jwt"); 
        updateCurrentUser(null);
      }
    } else {
      console.log("🚫 No token found in localStorage.");
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};