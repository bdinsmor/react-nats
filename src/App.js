import React from 'react';
import './App.less';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LoginComponent from './components/LoginComponent';
import Lineups from './components/lineups/Lineups';
import Players from './components/players/Players';
import Stats from './components/stats/Stats';

const App = (props) => (
  <Router>
    <div>
      <Routes>
        <Route path="/login" element={LoginComponent} />
        <Route path="/" element={<Home />}>
          <Route path="lineups" element={<Lineups />} />
          <Route path="players" element={<Players />} />
          <Route path="stats" element={<Stats />} />
          <Route path="*" element={<Lineups />} />
        </Route>
      </Routes>
    </div>
  </Router>
);

export default App;
