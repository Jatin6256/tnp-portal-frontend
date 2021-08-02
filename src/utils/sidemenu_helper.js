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

const profile = (type) => {
  type == "STUDENT" && Router.push("/dashboard/student/profile");
  type == "COMPANY" && Router.push("/dashboard/company/profile");
};

const positions = (type) => {
  type == "COMPANY" && Router.push("/dashboard/company/positions");
  type == "STUDENT" && Router.push("/dashboard/student/positions");
};

const settings = (type) => {
  Router.push("/dashboard/settings");
};

const enrolledPositions = (type) => {
  type == "STUDENT" && Router.push("/dashboard/student/enrolledPositions");
};

module.exports = {
  logout,
  profile,
  positions,
  settings,
  enrolledPositions,
};
