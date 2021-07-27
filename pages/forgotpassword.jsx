import React from "react";
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
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Training and Placement Cell, IIITR
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

  async function onFormSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("form-email").value;
    // if (!RecaptchaRef.current.getValue())
    //   return alert("Please fill the captcha");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/changePassword`,
        {
          method: "email",
          email,
          g_recaptcha: RecaptchaRef.current.getValue(),
          baseUrl: `${window.location.origin}/resetpassword`,
        }
      );
      alert("Please check your email for further instructions!");
    } catch (err) {
      alert(err.message);
    }
  }

  function onRecaptchaChange(value) {}

  return (
    <Container component="main" maxWidth="xs">
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
              sitekey={
                process.env.RECAPTCHA_SITE_KEY ||
                "6LcZZ8QbAAAAAM83c3_YPSJNQTCPhjNOhUX6wCYA"
              }
              ref={RecaptchaRef}
              onChange={onRecaptchaChange}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Confirmation Email
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">
                Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
