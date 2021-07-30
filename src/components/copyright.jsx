import { Typography } from "@material-ui/core";
import Link from "./Link";

export default function Copyright() {
  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://tnp.iiitr.ac.in/">
          <a target="_blank" rel="noreferrer">Training and Placement Cell, IIIT Raichur</a>
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </div>
  );
}
