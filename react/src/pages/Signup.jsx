import React from 'react';

const Signup = () => (
  <div className="container">
    <h2>Sign Up</h2>
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
    <p>Already have an account? <a href="/login">Login</a></p>
  </div>
);

export default Signup;
