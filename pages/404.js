import React from "react";
import Router from "next/router";

export default function func404() {
  React.useEffect(() => {
    Router.push("/");
  }, []);
  return <div />;
}
