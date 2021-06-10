import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Favourite from "./Favourite";
const Navbar = (props) => {
  const { auth } = props;
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MovieProject
        </Link>
        {!auth ? (
          <div className="navbar-nav">
            <Link to="/login" className="nav-link active">
              Login
            </Link>
            <Link to="/signup" className="nav-link active">
              Signup
            </Link>
          </div>
        ) : (
          <div className="navbar-nav">
            <Link to="/favourite" className="nav-link active">
              Favourite
            </Link>
            <Link to="/" className="nav-link active" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
