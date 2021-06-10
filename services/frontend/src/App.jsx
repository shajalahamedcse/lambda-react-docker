import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Cookies from "js-cookie";
import { authenticate } from "./api/auth";
import Favourite from "./Favourite";
const App = () => {
  const [auth, setAuth] = useState(false);
  const [idtoken, setIdtoken] = useState({});
  useEffect(() => {
    const token = Cookies.get("token");
    if (!!token) {
      console.log("authenticated");
      authenticate(JSON.parse(token).id, JSON.parse(token).token);
      setAuth(true);
      setIdtoken(JSON.parse(token));
    }
  }, []);
  return (
    <div className="">
      <Navbar auth={auth} />
      <Switch>
        <Route path="/login">
          <Login auth={auth} />
        </Route>
        <Route path="/signup">
          <Signup auth={auth} />
        </Route>
        <Route>
          {auth ? (
            <Switch>
              <Favourite path="/favourite" auth={auth} idtoken={idtoken} />
              <Home path="/" auth={auth} idtoken={idtoken} />
            </Switch>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        {/* <Route path="/" component={Home} /> */}
      </Switch>
    </div>
  );
};

export default App;
