import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    position: "fixed",
    bottom: 50,
    left: "50%",
    transform: "translateX(-50%)",
    margin: "auto",
    minWidth: "80vw",
    maxWidth: "1200px",
    zIndex: 2000000,
  },
}));

export default function DescriptionAlerts(props) {
  const classes = useStyles();

  var { message, type, hidden } = props.data;
  if (hidden == undefined) hidden = true;

  return (
    <div hidden={hidden} className={classes.root}>
      <Alert severity={type || "error"}>
        {message || "This is default message"}
      </Alert>
    </div>
  );
}
