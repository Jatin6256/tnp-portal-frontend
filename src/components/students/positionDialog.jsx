import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, DialogActions } from "@material-ui/core";
import { Dialog, DialogContent, Paper, Divider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import DataTable from "../table";
import axiosUtil from "../../../src/utils/axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    "& > * + *": {
      margin: "20px !important",
    },
  },
  root: {
    "& > * + *": {
      margin: 20,
    },
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  open,
  flier,
  handleClose,
  data,
  enrolledPage,
}) {
  const classes = useStyles();
  var tableData = {
    Type: data.type,
    "Total Hires": data.hires,
    Location: data.location,
    Duration: data.duration,
    Salary: data.salary,
    "Minimum CGPA": data.minCGPA,
    "PPO Available": data.ppoAvailable,
  };

  async function handleEnrollPosition(e) {
    let confirmed = confirm("You can't redo this. You sure?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axiosUtil("/manager/student/enroll", "post", token, {
        positionId: data.id,
      });
      return flier("success", "You've enrolled for this position.");
    } catch (err) {
      return flier(
        "error",
        (err.response && err.response.data.msg) || err.message
      );
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TNP IIIT Raichur
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <DialogContent>
            <Box m={1}>
              <div className={classes.flex}>
                <Typography variant="h3">{data.name}</Typography>
              </div>
            </Box>
            <Divider />
            <Box m={3}>
              <Typography variant="body1">{data.description}</Typography>
            </Box>
            <Box m={3}>
              <DataTable data={tableData} />
            </Box>
          </DialogContent>
          <DialogActions>
            {!enrolledPage && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEnrollPosition}
              >
                Enroll for this position
              </Button>
            )}
          </DialogActions>
        </Paper>
      </div>
    </Dialog>
  );
}
