// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Browse from './pages/Browse'; // Ensure this path is correct
import MovieMatch from './pages/MovieMatch'; // Import the MovieMatch component

const App = () => (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/MovieMatch" element={<MovieMatch />} /> {/* Update path */}
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </div>
  </Router>
);

export default App;
