import React from "react";
import {
  Dialog,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axiosUtil from "../../utils/axios";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    "& > * + *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function PositionForm(props) {
  const classes = useStyles();
  const { open, handleClose, flier } = props;
  const [positionType, setPositionType] = React.useState("INTERNSHIP");
  const [intern, setIntern] = React.useState(true);

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  async function handleSubmit(e) {
    e.preventDefault();

    var formData = new FormData(e.target);
    var data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });
    data.type = positionType;

    try {
      const token = localStorage.getItem("token");
      await axiosUtil("/metadata/positions", "post", token, data);
      handleClose();
      return flier("success", "Position created successfully");
    } catch (error) {
      return flier(
        "error",
        (error.response && error.response.data.msg) || error.message
      );
    }
  }

  function handlePositionTypeChange(e) {
    setPositionType(e.target.value);
    e.target.value === "INTERNSHIP" ? setIntern(true) : setIntern(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create new position"
      className={classes.paper}
    >
      <DialogTitle>Create new Position</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Students will be able to see the position as soon as you create it. To
          see the students who have applied to the position, set the status to{" "}
          <b>CLOSE</b>.
        </DialogContentText>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            autoFocus
            id="form-name"
            name="name"
            label="Title"
            type="text"
            autoComplete="off"
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            autoFocus
            id="form-description"
            name="description"
            label="Description"
            type="text"
            autoComplete="off"
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            autoFocus
            id="form-hires"
            name="hires"
            label="No. of hires"
            type="number"
            autoComplete="off"
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            autoFocus
            id="form-location"
            name="location"
            label="Location"
            type="text"
            placeholder="Remote / Site A / Site B"
            autoComplete="off"
            fullWidth
            required
            variant="outlined"
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={positionType}
              onChange={handlePositionTypeChange}
              label="Type"
            >
              <MenuItem value="PLACEMENT">PLACEMENT</MenuItem>
              <MenuItem value="INTERNSHIP">INTERNSHIP</MenuItem>
            </Select>
          </FormControl>
          {intern && (
            <TextField
              autoFocus
              id="form-duration"
              name="duration"
              label="Duration (in weeks)"
              type="number"
              autoComplete="off"
              fullWidth
              required
              variant="outlined"
            />
          )}
          {intern && (
            <TextField
              autoFocus
              id="form-salary"
              name="salary"
              label="Salary"
              type="number"
              autoComplete="off"
              fullWidth
              required
              variant="outlined"
            />
          )}
          <TextField
            autoFocus
            id="form-minCGPA"
            name="minCGPA"
            label="Minimum CGPA"
            type="number"
            defaultValue={0}
            autoComplete="off"
            inputProps={{
              step: "0.01",
            }}
            fullWidth
            variant="outlined"
          />
          <TextField
            autoFocus
            id="form-forBatch"
            name="forBatch"
            label="For students of batch started in"
            placeholder="YYYY"
            type="number"
            required
            autoComplete="off"
            fullWidth
            variant="outlined"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="pocName"
            label="Point of Contact (Name)"
            type="text"
            id="form-pocName"
            autoComplete="name"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="pocEmail"
            label="Point of Contact (Email)"
            type="email"
            id="form-pocEmail"
            autoComplete="email"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="pocPhone"
            label="Point of Contact (Phone)"
            type="tel"
            id="form-pocPhone"
            autoComplete="phone"
          />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
