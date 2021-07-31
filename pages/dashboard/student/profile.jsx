import React from "react";
import Head from "next/head";
import Router from "next/router";
import SideMenu from "../../../src/components/dashboardsidebar";
import { makeStyles } from "@material-ui/styles";
import {
  CircularProgress,
  Typography,
  Avatar,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
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
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > * + *": {
      margin: 10,
    },
  },
  large: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [profileData, setProfileData] = React.useState({});
  const [user, setUser] = React.useState({});
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

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axiosUtil("/metadata/students", "get", token);
          setProfileData({
            "First Name": res.data.fName,
            "Last Name": res.data.lName,
            Address: res.data.address,
            "Roll Number": String(res.data.roll).toUpperCase(),
            Email: res.data.email,
            "Phone Number": res.data.phone,
            Department: res.data.department,
            Year: res.data.year,
            CGPA: res.data.cgpa,
            "Semester till CGPA is provided": res.data.semTillCGPA,
            "Resume Link": res.data.resume,
            "Profile Verified": res.data.verified ? "Yes" : "No",
          });
          const user = JSON.parse(localStorage.getItem("user"));
          user.name = `${res.data.fName} ${res.data.lName}`;
          setUser(user);
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
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Head>
        <title>Profile</title>
      </Head>
      <SideMenu userType="STUDENT">
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
        {!loading && (
          <div className={classes.container}>
            <Avatar
              className={classes.large}
              src={user.avatar}
              alt={user.name}
              height={100}
            />
            <Typography color="primary" variant="h4">
              {user.name}
            </Typography>
            <DataTable data={profileData} />
            {/* <div>
              <Button>
                <Avatar button className={classes.secondary}>
                  <EditIcon color="white" />
                </Avatar>
                {"  "}
                <Typography>Edit Profile</Typography>
              </Button>
            </div> */}
          </div>
        )}
      </SideMenu>
      <Flier data={FlierData} />
    </div>
  );
}
