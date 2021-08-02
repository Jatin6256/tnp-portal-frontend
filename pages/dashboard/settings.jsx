import React from "react";
import Head from "next/head";
import Router from "next/router";
import SideMenu from "../../src/components/dashboardsidebar";
import { makeStyles } from "@material-ui/styles";
import {
  CircularProgress,
  Typography,
  Avatar,
  Button,
} from "@material-ui/core";
import axiosUtil from "../../src/utils/axios";
import fileToBase64 from "../../src/utils/fileToBase64";
import Flier from "../../src/components/flier";

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
  const AvatarInputRef = React.createRef();
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

  function handleChangeAvatar(e) {
    AvatarInputRef.current.click();
  }

  async function uploadAvatar(e) {
    if (!e.target.files) return;
    let avatar = await fileToBase64(e.target.files[0]);
    try {
      const token = localStorage.getItem("token");
      await axiosUtil("/users/avatar", "put", token, { avatar });
      return flier(
        "success",
        "Avatar updated successfully. Effect can be seen on next login."
      );
    } catch (err) {
      return flier(
        "error",
        (err.response && err.response.data.msg) || err.message,
        true
      );
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
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
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        Router.push("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Head>
        <title>Settings</title>
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
              alt={user.username}
              height={100}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleChangeAvatar}
            >
              Change Avatar
            </Button>
            <input
              hidden
              ref={AvatarInputRef}
              onChange={uploadAvatar}
              accept="image/*"
              type="file"
            ></input>
            <Typography color="primary" variant="h4">
              {user.username}
            </Typography>
          </div>
        )}
      </SideMenu>
      <Flier data={FlierData} />
    </div>
  );
}
