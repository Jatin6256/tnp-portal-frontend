import React from "react";
import SideMenu from "../../../../src/components/dashboardsidebar";
import Router from "next/router";
// import axiosUtil from "../../../../src/utils/axios";

export default function Position(props) {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Router.query.id;
      } catch (err) {}
    };
    fetchData();
  });

  return <SideMenu userType="COMPANY" />;
}
