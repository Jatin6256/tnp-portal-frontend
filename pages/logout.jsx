import { useEffect } from "react";
import Router from "next/router";
import { logout } from "../src/utils/sidemenu_helper";

export default function Logout() {
  useEffect(() => {
    logout();
    Router.push("/login");
  }, []);
  return <></>;
}
