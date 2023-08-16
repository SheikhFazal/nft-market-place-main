import React from "react";
import "./dashboard.css"
import CommonSection from "../components/ui/Common-section/CommonSection";
import DashboardNfts from "../components/ui/dashboardNfts/DashboardNfts";
import DashboardItem from "../components/ui/dashboardItem/DashboardItem";
import DashboardAuctions from "../components/ui/dashboardAuction/DashboardAuctions";
import DashboardAuctioned from "../components/ui/dashboardauctioned/dashboardauctioned";

const Dashboard = () => {
  return (
    <>
      <CommonSection title="Dashboard" />
      <section className="dashboardContainer">
        <DashboardNfts/>
        <DashboardAuctions/>

        <DashboardItem/>
        <DashboardAuctioned/>
      </section>
    </>
  );
};

export default Dashboard;
