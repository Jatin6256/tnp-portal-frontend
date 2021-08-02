import React from "react";
import SideMenu from "../../../src/components/dashboardsidebar";
import Head from "next/head";
import Router from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/styles";
import axiosUtil from "../../../src/utils/axios";
import Flier from "../../../src/components/flier";
import Listing from "../../../src/components/list";
import PositionDialog from "../../../src/components/students/positionDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
    "& > * + *": {
      margin: theme.spacing(3, 0),
    },
  },
  paper: {},
  loader: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Positions() {
  const classes = useStyles();
  const [positionsData, setPositionsData] = React.useState([]);
  const [positionsDataComplete, setPositionsDataComplete] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState({});
  const [loading, setLoading] = React.useState(true);
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

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosUtil(
              "/manager/student/positions",
              "get",
              token
            ),
            positions = response.data.positions;
          setPositionsDataComplete(positions);
          var data = [];
          positions.forEach((position) => {
            data.push({
              id: position.id,
              Name: position.name,
              Type: position.type,
              Location: position.location,
              Status: position.status,
            });
          });
          setPositionsData(data);
          setLoading(false);
        } catch (err) {
          console.log(err);
          flier(
            "error",
            (err.response && err.response.data.msg) || err.message,
            true
          );
        }
      } else {
        Router.push("/");
      }
    };
    fetchData();
  }, []);

  /** @type {React.MouseEventHandler<HTMLButtonElement>} */
  function handlePositionView(e, id) {
    e.preventDefault();
    setCurrentPosition(
      positionsDataComplete.filter((position) => {
        return position.id === id;
      })[0]
    );

    setOpenDialog(true);
  }

  return (
    <div>
      <Head>
        <title>Positions</title>
      </Head>
      <SideMenu userType="STUDENT">
        {!loading && (
          <div className={classes.root}>
            <Listing
              data={positionsData}
              button={{ text: "View", onClick: handlePositionView }}
            ></Listing>
          </div>
        )}
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
      </SideMenu>
      <Flier data={FlierData}></Flier>
      <PositionDialog
        flier={flier}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        data={currentPosition}
        enrolledPage={true}
      />
    </div>
  );
}
