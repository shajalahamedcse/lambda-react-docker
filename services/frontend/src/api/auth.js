import axios from "axios";
import { API } from "../const";
import Cookies from "js-cookie";
import { Redirect } from "react-router";

export async function login(email, password) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "*/*",
        // "X-Requested-With": "*",
      },
    };
    console.log("Loggin in...");
    const res = await axios.post(API + "login", { email, password }, config);
    console.log("Logged in successfully");
    console.log(res.data);
    Cookies.set('token', {id: res.data.id, token: res.data.token});
    return res.data;
  } catch (e) {
    console.log("Login failed..");
    console.log(e.response.data);
    throw e.response.data;
  }
}

export async function signUp(username, email, password) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "*/*",
        // "X-Requested-With": "*",
      },
    };
    console.log("Signing up...");
    const res = await axios.post(
      API + "signup",
      { username, email, password },
      config
    );
    console.log("Sign up successful");
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log("Sign up failed..");
    console.log(e.response.data);
    throw e.response.data;
  }
}

export async function addNewFavourite(ID, movieId, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "*/*",
        // "X-Requested-With": "*",
        Authorization: token,
      },
    };
    console.log("Adding new favourite to the list...");
    const res = await axios.post(
      API + "add-new-favourite",
      { ID, movieId },
      config
    );
    console.log("Added successfully");
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log("failed..");
    console.log(e.response.data);
    throw e.response.data;
  }
}

export async function getFavourites(ID, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "*/*",
        // "X-Requested-With": "*",
        Authorization: token,
      },
    };
    const res = await axios.get(API + "get-favourites/" + ID, config);
    return res.data;
  } catch (e) {
    console.log("failed..");
    console.log(e.response.data);
    throw e.response.data;
  }
}

export async function authenticate(ID, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "*/*",
        // "X-Requested-With": "*",
        Authorization: token,
      },
    };
    const res = await axios.get(API + "authenticate", config);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e.response.data);
    throw e.response.data;
  }
}
