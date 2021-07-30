import React from "react";
import Router from "next/router";

export default function DashboardHome() {
  React.useEffect(() => Router.push("/dashboard/company/profile"));
  return <div />;
}
