import React from "react";
import "./app.css";
//import HeroSection from "../components/ui/HeroSection";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";

import Trending from "../components/ui/Trending-section/Trending";

// import StepSection from "../components/ui/Step-section/StepSection";

const Home = () => {
  return (
    <section className="dashboardContainer">
    
      {/* <div className="bgHome"> */}
      {/* <HeroSection /> */}
      <LiveAuction />
      <Trending /> 
      {/* <StepSection /> */}
      {/* </div> */}
      </section>
    
  );
};

export default Home;
