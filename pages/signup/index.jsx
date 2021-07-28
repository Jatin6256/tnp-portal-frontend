import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Router from "next/router";
import Head from "next/head";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ReCAPTCHA from "react-google-recaptcha";
import Copyright from "../../src/components/copyright";
import Flier from "../../src/components/flier";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) Router.push("/dashboard");
  }, []);

  const classes = useStyles();
  const [FlierData, setFlierData] = React.useState({});
  const RecaptchaRef = React.createRef();

  function flier(type, message, keep) {
    setFlierData({
      type,
      message,
      hidden: false,
    });
    if (!keep) setTimeout(() => setFlierData({}), 5000);
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    const password = e.target.elements["new-password"].value;
    const confirmPassword = e.target.elements["confirm-password"].value;
    const { username, email } = e.target.elements;

    if (password != confirmPassword)
      return flier("error", "Password doesn't match");

    if (!RecaptchaRef.current.getValue())
      return flier("info", "Please fill the reCAPTCHA");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/signup`,
        {
          username: username.value,
          email: email.value,
          type: "COMPANY",
          password,
          g_recaptcha: RecaptchaRef.current.getValue(),
        }
      );
      flier(
        "success",
        `We've sent a verification email to you. Please verify your email and visit back to create your profile.`,
        true
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", String(response.data.token));
      localStorage.setItem("userType", String(response.data.type));
    } catch (error) {
      return flier("error", error.response.data.msg);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Head>
          <title>Sign Up - Company</title>
        </Head>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="form-email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="form-username"
                label="Username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="new-password"
                label="New Password"
                type="password"
                id="new-password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="form-confirm-password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <div align="center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  ref={RecaptchaRef}
                />
              </div>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup/student" variant="body2">
                Student Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
        <Flier data={FlierData} />
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
