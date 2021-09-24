import React from "react";

export default function NumPad({ whenAction }) {
  return (
    <div className="numPad">
      <button onClick={() => whenAction(0)}>0</button>
      <button onClick={() => whenAction(1)}>1</button>
      <button onClick={() => whenAction(2)}>2</button>
      <button onClick={() => whenAction(3)}>3</button>
      <button onClick={() => whenAction(4)}>4</button>
      <button onClick={() => whenAction(5)}>5</button>
      <button onClick={() => whenAction(6)}>6</button>
      <button onClick={() => whenAction(7)}>7</button>
      <button onClick={() => whenAction(8)}>8</button>
      <button onClick={() => whenAction(9)}>9</button>
    </div>
  );
}
