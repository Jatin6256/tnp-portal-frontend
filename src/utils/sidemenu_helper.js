import axiosUtil from "../utils/axios";
import Router from "next/router";

const logout = async (e) => {
  console.log("Logout");
  const token = localStorage.getItem("token");
  try {
    await axiosUtil("/users/logout", "get", token);
  } catch (err) {}
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userType");
  Router.push("/");
};

module.exports = {
  logout,
};
