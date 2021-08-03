import axiosUtil from "../utils/axios";
import Router from "next/router";

const isStudent = () => localStorage.getItem("userType") === "STUDENT";

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

const profile = () => {
  !isStudent() && Router.push("/dashboard/company/profile");
  isStudent() && Router.push("/dashboard/student/profile");
};

const positions = () => {
  !isStudent() && Router.push("/dashboard/company/positions");
  isStudent() && Router.push("/dashboard/student/positions");
};

const settings = () => {
  Router.push("/dashboard/settings");
};

const enrolledPositions = () => {
  isStudent() && Router.push("/dashboard/student/enrolledPositions");
};

module.exports = {
  logout,
  profile,
  positions,
  settings,
  enrolledPositions,
};
