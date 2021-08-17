import React from 'react';
import './App.less';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Dashboard from "./components/DashboardComponent";
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './components/ResetPassword';

const App = (props) => (
  <Router>
     <div>
      <Switch>
        <Route path="/login" component={LoginComponent} />
        <Route path="/reset-password" component={ResetPassword} />
        <ProtectedRoute path="/" component={Dashboard} />
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App;
