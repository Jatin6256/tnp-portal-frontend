import React from "react";
import Head from "next/head";
import Router from "next/router";
import SideMenu from "../../../src/components/dashboardsidebar";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import DataTable from "../../../src/components/table";
import axiosUtil from "../../../src/utils/axios";

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

  React.useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axiosUtil("/metadata/students", "get", token);
        setProfileData({
          "First Name": res.data.fName,
          "Last Name": res.data.lName,
          Address: res.data.address,
          "Roll Number": res.data.roll,
          Email: res.data.email,
          "Phone Number": res.data.phone,
          Department: res.data.department,
          Year: res.data.year,
          CGPA: res.data.cgpa,
          "Semester till CGPA is provided": res.data.semTillCGPA,
          "Resume Link": res.data.resume,
          "Profile Verified": res.data.verified ? "true" : "false",
        });
        setLoading(false);
      } catch (err) {
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
    </div>
  );
}
