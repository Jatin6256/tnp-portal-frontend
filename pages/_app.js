import "../styles/globals.css";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { LinearProgress } from "@material-ui/core";

function MyApp({ Component, pageProps }) {
  // const prefersDarkMode = localStorage.getItem("theme");
  // TODO: can be used to set theme. Add the switch in settings for theme choice and use here
  const [loader, setLoader] = useState(false);

  Router.events.on("routeChangeStart", (e) => setLoader(true));
  Router.events.on("routeChangeComplete", (e) => setLoader(false));
  Router.events.on("routeChangeError", (e) => setLoader(false));

  const theme = createTheme({
    palette: {
      type: "light",
      primary: { main: "#060c46" },
      secondary: { main: "#4AD892" },
      error: { main: "#e57373" },
      warning: { main: "#ffb74d" },
      info: { main: "#64b5f6" },
      success: { main: "#81c784" },
    },
    typography: {
      fontFamily: "Poppins",
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <Head>
        <link
          rel="icon"
          href="/tnp.svg"
          sizes="any"
          type="logos/svg+xml"
        ></link>
        <title>TNP IIITR</title>
        <meta
          name="description"
          content="TNP IIIT Portal. One stop destination to manage recruitment process for everyone."
        />
        <link rel="apple-touch-icon" href="/tnp.svg" />
      </Head>
      {loader && (
        <LinearProgress
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 2000000,
          }}
          color="secondary"
        />
      )}
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default MyApp;
