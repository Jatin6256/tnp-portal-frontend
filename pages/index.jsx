import Router from "next/router";
import React from "react";
import axiosUtil from "../src/utils/axios";
import styles from "../styles/index.module.css";
import { LinearProgress } from "@material-ui/core";

export default function Dashboard() {
  React.useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const r = await axiosUtil("/users/profileExists", "get", {}, {}, token);
        const userType = localStorage.getItem("userType");
        userType == "COMPANY" && Router.push("dashboard/company");
        userType == "STUDENT" && Router.push("dashboard/student");
      } catch (err) {
        if (err.response) {
          if (err.response.status == 405)
            Router.push("dashboard/createProfile");
          if (err.response.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userType");
            Router.push("/login");
          }
        }
      }
    } else Router.push("/login");
  }, []);

  return (
    <div className={styles.container}>
      <h1>Redirecting you to your destiny</h1>
      <LinearProgress />
    </div>
  );
}
