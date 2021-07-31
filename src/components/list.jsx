import React from "react";
import Router from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Listing(props) {
  const classes = useStyles();
  const data = Array(props.data);
  const { button } = props;

  function buttonAction(id) {
    Router.push(`${Router.pathname}/${id}`);
  }

  function parse(data) {
    try {
      var url = new URL(data);
      return (
        <a href={data} target="_blank" rel="noreferrer">
          {data}
        </a>
      );
    } catch (err) {
      return data;
    }
  }

  var keys = Object.keys(data[0]);
  keys = keys.filter((key) => key != "id");

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {keys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id}>
                {keys.map((key) => (
                  <TableCell key={key} align="left">
                    {parse(item[key])}
                  </TableCell>
                ))}
                {true && (
                  <TableCell key={item.id} align="left">
                    <Button
                      onClick={() => buttonAction(item.id)}
                      variant="contained"
                      color="primary"
                    >
                      {button.text}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
