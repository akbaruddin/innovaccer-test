import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Upload from './Upload';

export default function Routes(){
  return (
    <>
      <Router>
        <Switch>
          <Route path="/patients/:userId">
            <Profile />
          </Route>
          <Route path="/upload/">
            <Upload />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  ); 
}
