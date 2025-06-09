import React, { createContext, useContext } from "react";

export const CurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);

export const CurrentUserProvider = ({ children, currentUser, setCurrentUser }) => {
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
