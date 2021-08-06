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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Dialog,
} from "@material-ui/core";
import ReCAPTCHA from "react-google-recaptcha";
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
      margin: theme.spacing(3),
    },
  },
  large: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
  },
  redButton: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "#e65353",
    },
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const AvatarInputRef = React.createRef();
  const currentPassword = React.createRef();
  const RecaptchaRef = React.createRef();
  const [user, setUser] = React.useState({});
  const [changePassword, setChangePassword] = React.useState(false);
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

  async function passwordRequest(e) {
    e.preventDefault();
    if (!RecaptchaRef.current.getValue())
      return flier("warning", "Please fill the reCAPTCHA");

    const g_recaptcha = RecaptchaRef.current.getValue();
    RecaptchaRef.current.reset();

    const password = e.target.elements["password"].value;
    try {
      const accessToken = localStorage.getItem("token");
      const response = await axiosUtil(
        "/users/changePassword",
        "post",
        accessToken,
        {
          method: "password",
          password,
          g_recaptcha,
        }
      );
      const { token } = response.data.token;
      Router.push(`/resetpassword?token=${token}`);
    } catch (err) {
      return flier(
        "error",
        (err.response && err.response.data.msg) || err.message,
        true
      );
    }
  }

  return (
    <div className={classes.root}>
      <Head>
        <title>Settings</title>
      </Head>
      <SideMenu>
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
            <Typography color="primary" variant="h6">
              <b>Username</b>: {user.username}
              <br />
              <b>Email</b>: {user.email}
            </Typography>
            <Button
              className={classes.redButton}
              onClick={() => setChangePassword(true)}
            >
              Change Password
            </Button>
            <Dialog
              maxWidth="xs"
              fullWidth
              open={changePassword}
              onClose={() => setChangePassword(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                <form onSubmit={passwordRequest}>
                  <TextField
                    autoFocus
                    ref={currentPassword}
                    id="form-password"
                    name="password"
                    label="Current Password"
                    type="password"
                    autoComplete="password"
                    fullWidth
                    required
                  />
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    ref={RecaptchaRef}
                  />
                  <DialogActions>
                    <Button
                      onClick={() => setChangePassword(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button color="primary" variant="contained" type="submit">
                      Confirm
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </SideMenu>
      <Flier data={FlierData} />
    </div>
  );
}
