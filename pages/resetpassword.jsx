import React from "react";
import Head from "next/head";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../src/components/copyright";
import Flier from "../src/components/flier";
import ReCAPTCHA from "react-google-recaptcha";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

  let token;

  React.useEffect(() => {
    let url = new URL(window.location.href);
    token = url.searchParams.get("token");
    if (!token || token == "")
      return flier("error", "This link in invalid.", true);
  }, []);

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

    const newPassword = e.target.elements["new-password"].value;
    const confirmPassword = e.target.elements["confirm-password"].value;

    if (newPassword != confirmPassword)
      return flier("error", "Password doesn't match");

    const regex =
      "^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$";
    // See this https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength

    if (!String(newPassword).match(regex))
      return flier("error", "Password criteria not fulfilled!");

    if (!RecaptchaRef.current.getValue())
      return flier("info", "Please fill the reCAPTCHA");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/uses/resetPassword`,
        {
          g_recaptcha: RecaptchaRef.current.getValue(),
          token,
          password: newPassword,
        }
      );
      return flier("success", "Password changed successfully");
    } catch (error) {
      return flier("error", error.response.data.msg);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>Forgot Password</title>
      </Head>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="new-password"
            label="New Password"
            type="password"
            id="form-new-password"
            autoComplete="new-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="form-confirm-password"
            autoComplete="confirm-password"
          />
          <div align="center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              ref={RecaptchaRef}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Login"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Flier data={FlierData} />
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
