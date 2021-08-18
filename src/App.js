import React from 'react';
import './App.less';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Home from "./components/Home";
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './components/ResetPassword';

const App = (props) => (
  <Router>
     <div>
      <Switch>
        <Route path="/login" component={LoginComponent} />
        <Route path="/reset-password" component={ResetPassword} />
        <ProtectedRoute path="/" component={Home} />
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App;
