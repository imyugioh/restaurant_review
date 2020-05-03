import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./setAuthToken";
import { setCurrentUser } from "./actions/authentication";
import { setError } from "./actions/errors";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Rests from "./components/Restaurants";
import Reviews from "./components/Reviews";
import Users from "./components/Users";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    localStorage.removeItem("jwtToken");
    store.dispatch(setCurrentUser({}));
    store.dispatch(setError({}));
    setAuthToken(false);
    window.location.href = "/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <NavBar />
            <Route exact path="/" component={Rests} />
            <Route path="/reviews/:id" component={Reviews} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
