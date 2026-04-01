import React from "react";

function Payments() {
  return (
    <div className="card">
      <h2>Process Payment</h2>

      <input placeholder="Patient Name" />
      <input placeholder="Amount" />

      <select>
        <option>UPI</option>
        <option>Credit Card</option>
        <option>Debit Card</option>
        <option>Net Banking</option>
      </select>

      <button>Pay Now</button>
    </div>
  );
}

export default Payments;