import "../styles/globals.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

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
        <meta
          name="description"
          content="TNP IIIT Portal. One stop destination to manage recruitment process for everyone."
        />
        <link rel="apple-touch-icon" href="/tnp.svg" />
      </Head>
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default MyApp;
