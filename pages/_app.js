import "../styles/globals.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { LinearProgress } from "@material-ui/core";

function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [loader, setLoader] = useState(false);

  Router.events.on("routeChangeStart", (e) => setLoader(true));
  Router.events.on("routeChangeComplete", (e) => setLoader(false));
  Router.events.on("routeChangeError", (e) => setLoader(false));

  const theme = createTheme({
    palette: {
      primary: {
        // light: palette.primary[300],
        main: "#060c46",
        // dark: palette.primary[700],
        // contrastText: getContrastText(palette.primary[500]),
      },
      secondary: {
        //   light: palette.secondary.A200,
        main: "#4AD892",
        //   dark: palette.secondary.A700,
        //   contrastText: getContrastText(palette.secondary.A400),
      },
      // error: {
      //   light: palette.error[300],
      //   main: palette.error[500],
      //   dark: palette.error[700],
      //   contrastText: getContrastText(palette.error[500]),
      // },
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
