import React from "react";

export default function MathOperationsPad({ onAction }) {
  return (
    <div className="mathOperationsPad">
      <button onClick={() => onAction("+")}>+</button>
      <button onClick={() => onAction("-")}>-</button>
    </div>
  );
}
