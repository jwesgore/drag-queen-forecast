import React from "react";
import "./UnitToggle.css";

interface UnitToggleProps {
  unit: "F" | "C";
  onToggle: (unit: "F" | "C") => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
  return (
    <button
      className={`unit-toggle${unit === "F" ? " unit-f" : " unit-c"}`}
      onClick={() => onToggle(unit === "F" ? "C" : "F")}
      aria-label="Toggle temperature unit"
    >
      <span className={unit === "F" ? "active" : ""}>°F</span>
      <span className="divider">|</span>
      <span className={unit === "C" ? "active" : ""}>°C</span>
    </button>
  );
};

export default UnitToggle;
