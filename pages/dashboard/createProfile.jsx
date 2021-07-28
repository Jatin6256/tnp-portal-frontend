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

export default function CreateProfile() {
  let [user, setUser] = React.useState("");

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) Router.push("/login");
    setUser(user);
  }, []);

  const classes = useStyles();
  const [FlierData, setFlierData] = React.useState({});

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

    var formData = new FormData(e.target);
    var data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });

    try {
      await axiosUtil(
        "/metadata/company",
        "post",
        data,
        {},
        localStorage.getItem("token")
      );
      flier("success", `Your profile is created successfully.`);
    } catch (error) {
      return flier("error", error.response.data.msg);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>Create Profile</title>
      </Head>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Profile
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="form-name"
                label="Name"
                name="name"
                autoComplete="name"
                type="text"
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
                name="phone"
                label="Phone"
                type="tel"
                id="phone"
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                placeholder="https://example.com"
                name="website"
                label="Website"
                type="text"
                id="form-website"
                autoComplete="website"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="category"
                label="Company Category"
                type="text"
                placeholder="IT / Consultancy / Management"
                id="form-category"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="sector"
                label="Company Sector"
                type="text"
                placeholder="Govt. / Private / Public"
                id="form-sector"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="mainPOCName"
                label="Point of Contact (Name)"
                type="text"
                id="form-poc-name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="mainPOCEmail"
                label="Point of Contact (Email)"
                type="email"
                id="form-poc-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="mainPOCPhone"
                label="Point of Contact (Phone)"
                type="tel"
                id="form-poc-phone"
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="mainPOCPosition"
                label="Point of Contact (Position in Company)"
                type="text"
                id="form-poc-position"
                autoComplete="position"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
        <Flier data={FlierData} />
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
