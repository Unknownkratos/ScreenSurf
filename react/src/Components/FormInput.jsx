// src/components/FormInput.jsx
import React from 'react';

const FormInput = ({ label, type, value, onChange }) => (
  <div className="form-group">
    <label>{label}</label>
    <input 
      type={type}
      className="form-control"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default FormInput;
