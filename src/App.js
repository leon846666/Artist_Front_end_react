// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CDList from './CDList';
import CdDetails from './CdDetails'; // Assuming you have this component

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={CDList} />
        <Route path="/cd/:title" component={CdDetails} />
      </Switch>
    </Router>
  );
};

export default App;
