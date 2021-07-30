import Router from "next/router";
import React from "react";
import axiosUtil from "../src/utils/axios";
import { LinearProgress, Typography, makeStyles } from "@material-ui/core";

const style = makeStyles((theme) => {
  return {
    boldHeadline: {
      fontWeight: 600,
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "left",
      justifyContent: "center",
      flexDirection: "column",
      "& > * + *": {
        width: "100%",
        padding: 2,
        margin: "10px 0px",
      },
    },
  };
});

export default function Dashboard() {
  const classes = style();
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
    <div className={classes.container}>
      <Typography color="primary" variant="h4" className={classes.boldHeadline}>
        Redirecting you to your destiny
      </Typography>
      <LinearProgress color="secondary" />
    </div>
  );
}
