import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Signup from "./components/User/Signup/Signup";
import Login from "./components/User/Login/Login";
import Profile from "./components/User/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App__container">
          <Switch>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Profile />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
