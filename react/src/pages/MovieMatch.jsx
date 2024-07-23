import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Step1Movies from '../Components/Step1Movies';
import Step2Genres from '../Components/Step2Genres';
import Step3Actor from '../Components/Step3Actor';
import Recommendations from '../Components/Recommendations';

const MovieMatch = () => {
  return (
    <Routes>
      <Route path="/step1" element={<Step1Movies />} />
      <Route path="/step2" element={<Step2Genres />} />
      <Route path="/step3" element={<Step3Actor />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/" element={<Step1Movies />} /> {/* Default to Step 1 */}
    </Routes>
  );
};

export default MovieMatch;
