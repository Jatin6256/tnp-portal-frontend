import React from "react";
import Router from "next/router";

export default function DashboardHome() {
  React.useEffect(() => Router.push("profile"));
  return <div />;
}
