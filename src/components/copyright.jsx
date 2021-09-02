import { Typography } from "@material-ui/core";

export default function Copyright() {
  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="body2" color="inherit" align="center">
        {"Copyright © "}
        <a target="_blank" rel="noreferrer" href="https://tnp.iiitr.ac.in/">
          <b>Training and Placement Cell, IIIT Raichur</b>
        </a>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="body2" color="inherit" align="center" style={{marginTop: "10px"}}>
        {"Made with ❤️ by "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/crossphoton"
        >
          <b>crossphoton</b>
        </a>
        {" & "}
        <a target="_blank" rel="noreferrer" href="https://github.com/Jatin6256">
          <b>Jatin6256</b>
        </a>
      </Typography>
    </div>
  );
}
