import React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Link from "../src/components/Link";
import Copyright from "../src/components/copyright";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Flier from "../src/components/flier";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import logo from "../public/tnp.svg";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "100vh",
  },
  image: {
    "& > * + *": {
      margin: 20,
      color: "white",
    },
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) Router.push("/");
  }, []);

  const classes = useStyles();
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

  const RecaptchaRef = React.createRef();
  var [loading, setLoading] = React.useState(false);

  async function loginSubmit(e) {
    e.preventDefault();
    if (!RecaptchaRef.current.getValue())
      return flier("warning", "Please fill the reCAPTCHA");

    const { username, password } = e.target.elements;
    const g_recaptcha = RecaptchaRef.current.getValue();
    RecaptchaRef.current.reset();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`,
        {
          username: username.value,
          password: password.value,
          g_recaptcha,
        }
      );
      flier("success", `Welcome ${response.data.username}`);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", String(response.data.token));
      localStorage.setItem("userType", String(response.data.type));
      Router.push("/");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return flier("error", err.response.data.msg);
    }
  }

  // TODO: Add remember me (Store username and password and refresh token in background)
  return (
    <Grid container component="main" className={classes.main}>
      <Head>
        <title>Login</title>
      </Head>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image}>
        <div className={classes.image}>
          <Image src={logo} width={200} height={200} alt="TNP IIITR"></Image>
          <Typography component="h1" variant="h4" color="primary">
            Training and Placement Cell
          </Typography>
          <Typography component="h1" variant="body1">
            Indian Institute of Information Technology Raichur
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={loginSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              ref={RecaptchaRef}
            />
            {loading && (
              <CircularProgress
                style={{ padding: 10, margin: 20 }}
                color="white"
              />
            )}
            {!loading && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <Typography variant="body2">Sign in</Typography>
              </Button>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
          <Flier data={FlierData} />
        </div>
      </Grid>
    </Grid>
  );
}
