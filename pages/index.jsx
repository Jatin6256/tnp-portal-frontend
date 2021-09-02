import Router from "next/router";
import React from "react";
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
    float: {
      position: "absolute",
      bottom: "10vh",
      right: "20vw",
      cursor: "pointer",
    },
  };
});

export default function Dashboard() {
  const classes = style();
  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axiosUtil("/users/profileExists", "get", token);
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
    };
    fetchData();
  }, []);

  function stuckRedirect() {
    Router.push("/logout");
  }

  return (
    <div className={classes.container}>
      <div className={classes.float} onClick={stuckRedirect}>
        <Typography color="secondary" variant="h6">
          Stuck?
        </Typography>
      </div>
      <Typography color="primary" variant="h4" className={classes.boldHeadline}>
        Redirecting you to your destiny
      </Typography>
      <LinearProgress color="secondary" />
    </div>
  );
}
