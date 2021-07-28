import { Typography } from "@material-ui/core";
import Link from "next/link";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://tnp.iiitr.ac.in/">
        <a target="_blank">Training and Placement Cell, IIIT Raichur</a>
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
