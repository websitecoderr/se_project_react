import { useEffect, useState } from "react";
import { useCurrentTemperatureUnit } from "../Context/CurrentTemperatureUnitContext";
import "./ToggleSwitch.css";

const ToggleSwitch = () => {
  const { currentTemperatureUnit, handleToggleSwitchChange } = useCurrentTemperatureUnit();
  const [isChecked, setIsChecked] = useState(currentTemperatureUnit === "C");

  useEffect(() => {
    setIsChecked(currentTemperatureUnit === "C");
  }, [currentTemperatureUnit]);

  const handleToggleChange = () => {
    handleToggleSwitchChange();
  };

  return (
    <div className="toggle-switch">
      <label>
        <input
          type="checkbox"
          className="toggle-switch__checkbox"
          checked={isChecked}
          onChange={handleToggleChange}
        />
        <span className="toggle-switch__circle"></span>
        <span
          className={`toggle-switch__text toggle-switch__text_F ${
            currentTemperatureUnit === "F"
              ? "toggle-switch__text_color_white"
              : ""
          }`}
        >
          F
        </span>
        <span
          className={`toggle-switch__text toggle-switch__text_C ${
            currentTemperatureUnit === "C" ? "toggle-switch__text_color_white" : ""
          }`}
        >
          C
        </span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
