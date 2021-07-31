import React from "react";
import SideMenu from "../../../../src/components/dashboardsidebar";
import Head from "next/head";
import Router from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/styles";
import axiosUtil from "../../../../src/utils/axios";
import Flier from "../../../../src/components/flier";
import Listing from "../../../../src/components/list";
import Button from "@material-ui/core/Button";
import PositionForm from "../../../../src/components/positionform";

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
  const [openForm, setOpenForm] = React.useState(false);
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
          const response = await axiosUtil("/metadata/positions", "get", token),
            positions = response.data.positions;
          var data = [];
          positions.forEach((position) => {
            data.push({
              id: position.id,
              Name: position.name,
              Type: position.type,
              Location: position.location,
              POC: position.pocName,
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

  return (
    <div>
      <Head>
        <title>Positions</title>
      </Head>
      <SideMenu userType="COMPANY">
        {!loading && (
          <div className={classes.root}>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenForm(true)}
              >
                New
              </Button>
            </div>
            <Listing data={positionsData} button={{ text: "View" }}></Listing>
          </div>
        )}
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
      </SideMenu>
      <PositionForm
        open={openForm}
        flier={flier}
        handleClose={() => setOpenForm(false)}
      />
      <Flier data={FlierData}></Flier>
    </div>
  );
}
