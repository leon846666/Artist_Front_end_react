// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CDList from './components/cdLists';
import CdDetails from './components/cdDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CDList />} />
        <Route path="/cd/:title" element={<CdDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
