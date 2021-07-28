import { Typography } from "@material-ui/core";
import Link from "next/link";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Training and Placement Cell, IIIT Raichur
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
