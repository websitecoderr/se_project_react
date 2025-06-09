import React, { createContext, useContext, useState } from "react";

const CurrentTemperatureUnitContext = createContext();

export { CurrentTemperatureUnitContext };

export const CurrentTemperatureUnitProvider = ({ children }) => {
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      {children}
    </CurrentTemperatureUnitContext.Provider>
  );
};

export const useCurrentTemperatureUnit = () => {
  const context = useContext(CurrentTemperatureUnitContext);
  if (!context) {
    throw new Error(
      "useCurrentTemperatureUnit must be used within a CurrentTemperatureUnitProvider"
    );
  }
  return context;
};
