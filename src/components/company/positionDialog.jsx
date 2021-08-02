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
import exportFromJSON from "export-from-json";

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
  closePosition: {
    backgroundColor: "red",
    color: "white",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, flier, handleClose, data }) {
  const classes = useStyles();
  var [changed, setChanged] = React.useState(false);
  const openPosition = data.status === "OPEN";
  var tableData = {
    Type: data.type,
    "Total Hires": data.hires,
    Location: data.location,
    Duration: data.duration,
    Salary: data.salary,
    "Minimum CGPA": data.minCGPA,
    "PPO Available": data.ppoAvailable,
    "POC Name": data.pocName,
    "POC Phone": data.pocPhone,
    "POC Email": data.pocEmail,
  };

  async function handleClosePosition(e) {
    const confirmed = confirm(
      "Are you sure. Candidates can't register after this."
    );

    if (confirmed) {
      try {
        await axiosUtil(
          "/metadata/positions",
          "put",
          localStorage.getItem("token"),
          {
            positionId: data.id,
            change: { status: "CLOSED" },
          }
        );
        return flier("success", "Position is set to `CLOSED`");
      } catch (err) {
        return flier(
          "error",
          (err.response && err.response.data.msg) || err.message
        );
      }
    }
  }

  async function handleGetDataClick(format, e) {
    let students;
    try {
      const response = await axiosUtil(
        `/manager/position/students?positionId=${data.id}`,
        "get",
        localStorage.getItem("token")
      );
      students = response.data.students;
      if (students.length === 0) return flier("error", "No data available");
    } catch (err) {
      return flier(
        "error",
        (err.response && err.response.data.msg) || err.message
      );
    }
    let url = "";
    try {
      if (format == "xls") {
        const xls = exportFromJSON({
          data: students,
          exportType: exportFromJSON.types.xls,
          fileName: `${data.name}-${Date.now()}`,
        });
      } else if (format == "csv") {
        const csv = exportFromJSON({
          data: students,
          exportType: exportFromJSON.types.csv,
          fileName: `${data.name}-${Date.now()}`,
        });
      } else if (format == "json") {
        const blob = new Blob([JSON.stringify(students)], {
          type: "text/json",
        });
        url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("download", `${data.name}-${Date.now()}.${format}`);
        a.setAttribute("href", url);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      return flier("error", err.message);
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
          {changed && (
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <DialogContent>
            <Box m={1}>
              <div className={classes.flex}>
                <Typography variant="h3">{data.name}</Typography>
                {openPosition && (
                  <Button
                    className={classes.closePosition}
                    variant="contained"
                    onClick={handleClosePosition}
                  >
                    Close this position
                  </Button>
                )}
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
          {!openPosition && (
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={(e) => handleGetDataClick("xls", e)}
              >
                Get Registered Students as XLSX
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={(e) => handleGetDataClick("json", e)}
              >
                Get Registered Students as JSON
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={(e) => handleGetDataClick("csv", e)}
              >
                Get Registered Students as CSV
              </Button>
              <input hidden type="button" />
            </DialogActions>
          )}
        </Paper>
      </div>
    </Dialog>
  );
}
