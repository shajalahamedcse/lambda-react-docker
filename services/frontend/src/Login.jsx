import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL_LAMBDA } from "./config";
import { login } from "./api/auth";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { auth } = props;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.reload();
    } catch {
      alert("Check your email and password");
    }
  };
  useEffect(() => console.log(auth), []);
  if (auth) {
    console.log("nananana");
    return <Redirect to="/" />;
  }
  return (
    <div className="container" style={{ width: "50%" }}>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
