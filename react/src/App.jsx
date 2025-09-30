import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import MovieMatch from './pages/MovieMatch';
import MovieDetails from './pages/MovieDetails';

const App = () => (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/moviematch" element={<MovieMatch />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  </Router>
);

export default App;