import React from "react";
import Router from "next/router";

export default function Func404() {
  React.useEffect(() => {
    Router.push("/");
  }, []);
  return <div />;
}
