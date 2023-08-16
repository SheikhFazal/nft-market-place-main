import React from "react";
import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = (props) => {
  return (
    <div>
      <Header toogleTheme={props.toogleTheme} />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
