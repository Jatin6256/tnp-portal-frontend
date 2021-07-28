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
import { GoogleLogin } from "react-google-login";
import Copyright from "../../src/components/copyright";
import Flier from "../../src/components/flier";
import axiosUtil from "../../src/utils/axios";

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

export default function StudentSignUp() {
  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) Router.push("/dashboard");
  }, []);

  let GoogleToken;
  const classes = useStyles();
  const [FlierData, setFlierData] = React.useState({});
  const [googleAuthenticated, setGoogleAuthenticated] = React.useState(false);
  const RecaptchaRef = React.createRef();

  function flier(type, message, keep) {
    setFlierData({
      type,
      message,
      hidden: false,
    });
    if (!keep) setTimeout(() => setFlierData({}), 5000);
  }
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function onFormSubmit(e) {
    e.preventDefault();

    const password = e.target.elements["new-password"].value;
    const confirmPassword = e.target.elements["confirm-password"].value;

    if (password != confirmPassword)
      return flier("error", "Password doesn't match");

    if (!RecaptchaRef.current.getValue())
      return flier("info", "Please fill the reCAPTCHA");

    var formData = new FormData(e.target);
    var data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });
    data["resume"] = await toBase64(data["resume"]);
    data["access_token"] = GoogleToken;
    console.log(GoogleToken);
    data["g_recaptcha"] = RecaptchaRef.current.getValue();

    try {
      const response = await axiosUtil(
        "/users/signup/studentwithgoogle",
        "post",
        data
      );
      flier("success", `Your profile is create successfully.`, true);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", String(response.data.token));
      localStorage.setItem("userType", String(response.data.type));
    } catch (error) {
      return flier("error", error.response.data.msg);
    }
  }

  function responseGoogle(a) {
    GoogleToken = a.accessToken;
    setGoogleAuthenticated(true);
  }
  function responseGoogleError(a) {
    console.log(a);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Head>
          <title>Sign Up - Student</title>
        </Head>
        <div className="google-sign-in" hidden={googleAuthenticated}>
          <GoogleLogin
            clientId="655435592747-e1frtp3jenmhoi19g9mcb0jt132o4m16.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogleError}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <div className="signup-form" hidden={!googleAuthenticated}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Student Sign Up
          </Typography>
          <form className={classes.form} onSubmit={onFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-department"
                  label="Department"
                  name="department"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-year"
                  label="Admission Year"
                  name="year"
                  type="number"
                  min="2019"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-phone"
                  label="Phone"
                  name="phone"
                  autoComplete="phone"
                  type="tel"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-cgpa"
                  label="Current CGPA"
                  name="cgpa"
                  type="number"
                  autoComplete="off"
                  inputProps={{
                    step: "0.01",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="form-semTillCGPA"
                  label="Semester till provided CGPA"
                  name="semTillCGPA"
                  type="number"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
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
                  <Button variant="outlined" component="label">
                    Upload Resume
                    <input
                      accept="application/pdf"
                      name="resume"
                      required
                      type="file"
                    />
                  </Button>
                </div>
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
          </form>
          <Flier data={FlierData} />
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
