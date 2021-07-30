import Router from "next/router";

export default function DashboardHome() {
  Router.push("profile");
  return <div />;
}
