import React from "react";
import Head from "next/head";
import Router from "next/router";
import SideMenu from "../../../src/components/dashboardsidebar";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import DataTable from "../../../src/components/table";
import axiosUtil from "../../../src/utils/axios";
import Flier from "../../../src/components/flier";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  loader: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [profileData, setProfileData] = React.useState({});
  const [FlierData, setFlierData] = React.useState({
    hidden: true,
    type: "error",
    message: "This is default message",
  });

  function flier(type, message, keep) {
    setFlierData({
      type,
      message,
      hidden: false,
    });
    if (!keep) setTimeout(() => setFlierData({}), 5000);
  }

  React.useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axiosUtil("/metadata/students", "get", token);
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
        flier(
          "error",
          (err.response && err.response.data.msg) || err.message,
          true
        );
        console.log(err);
      }
    } else {
      localStorage.removeItem("token");
      Router.push("/");
    }
  }, []);

  return (
    <div className={classes.root}>
      <Head>
        <title>Profile</title>
      </Head>
      <SideMenu>
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
        {!loading && <DataTable data={profileData} />}
      </SideMenu>
      <Flier data={FlierData} />
    </div>
  );
}
