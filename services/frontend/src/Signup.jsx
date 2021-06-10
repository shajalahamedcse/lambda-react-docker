import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL_LAMBDA } from "./config";
import { signUp } from "./api/auth";
import { Redirect, useHistory } from "react-router";
const Signup = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { auth } = props;
  const histtory = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp(username, email, password);
    histtory.push("Home");
  };
  if (auth) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container" style={{ width: "50%" }}>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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

export default Signup;
