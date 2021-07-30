import React from "react";
import Head from "next/head";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "../src/components/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Flier from "../src/components/flier";
import Copyright from "../src/components/copyright";
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
  const RecaptchaRef = React.createRef();
  var [loading, setLoading] = React.useState(false);
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

  async function onFormSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("form-email").value;
    if (!RecaptchaRef.current.getValue())
      return flier("info", "Please fill the reCAPTCHA");
    const g_recaptcha = RecaptchaRef.current.getValue();
    RecaptchaRef.current.reset();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/changePassword`,
        {
          method: "email",
          email,
          g_recaptcha,
          baseUrl: `${window.location.origin}/resetpassword`,
        }
      );
      flier("success", "Please check your email for further instructions.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return flier("error", err.response.data.msg);
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
          Forgot Password
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="form-email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <div align="center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              ref={RecaptchaRef}
            />
          </div>
          {loading && (
            <div align="center">
              <CircularProgress
                style={{ padding: 10, margin: 20 }}
                color="white"
              />
            </div>
          )}
          {!loading && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Send Confirmation Email
            </Button>
          )}
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">
                Gotcha? Login instead
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <div>
        <Flier data={FlierData} />
      </div>
    </Container>
  );
}
