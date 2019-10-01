import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/navigation/Navigation';
import Login from './components/login/Login';
import Edit from './components/edit/Edit';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navigation></Navigation>
        <Route exact path="/login" component={Login} />
        <Route exact path="/edit" component={Edit} />
      </div>
    </Router>
  );
}

export default App;
