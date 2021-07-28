import Router from "next/router";
import React from "react";
import axiosUtil from "../../src/utils/axios";

export default function Dashboard() {
  let [user, setUser] = React.useState("");
  React.useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const r = await axiosUtil("/users/profileExists", "get", {}, {}, token);
        Router.push("dashboard/home");
      } catch (err) {
        if (err.response) {
          if (err.response.status == 405)
            Router.push("dashboard/createProfile");
          if (err.response.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Router.push("/login");
          }
        }
      }
    } else Router.push("/login");
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Current user: {user}</p>
    </div>
  );
}
