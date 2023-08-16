import React from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import "./footer.css";
import images from "../../assets/images/kk.png"

import { Link } from "react-router-dom";

const MY__ACCOUNT = [
  {
    display: "Author Profile",
    url: "/seller-profile",
  },
  {
    display: "Create Item",
    url: "/create",
  },
  {
    display: "Collection",
    url: "/market",
  },
  {
    display: "Edit Profile",
    url: "/edit-profile",
  },
];

const RESOURCES = [
  {
    display: "Help Center",
    url: "#",
  },
  {
    display: "Partner",
    url: "#",
  },
  {
    display: "Community",
    url: "#",
  },
  {
    display: "Activity",
    url: "#",
  },
];

const COMPANY = [
  {
    display: "About",
    url: "#",
  },
  {
    display: "Career",
    url: "#",
  },
  {
    display: "Ranking",
    url: "#",
  },
  {
    display: "Contact Us",
    url: "/contact",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="6" sm="6" className="mb-4">
            <div className="logo">
            <img src={images}  width="100" height="100" alt="Logo"/>
            <p> 
            Ouranos Exchange is part of Ouranos LLC, USA. Developed by NFT enthusiasts and providing an easy way to "Mint" your NFT, Buy/Sell/Auction on Ethereum Blockchain.
            It is a fast growing NFT marketplace.

            </p>
            </div>
          </Col>

     

        

          <Col lg="3" md="6" sm="6" className="mb-4">
          
            <div className="social__links d-flex gap-3 align-items-center ">
        
              <span>
                <a  href="https://www.instagram.com/ouranosexchange/" target="_blank">
                  <i class="ri-instagram-line"></i>
                </a>
              </span>
              <span>
              <a href="https://twitter.com/ExchOuranos" target="_blank">
                  <i class="ri-twitter-line"></i>
                  </a>
              </span>
            
              <span>
              <a href="https://discord.gg/Nrpm4rAcu9" target="_blank">
                  <i class="ri-discord-line"></i>
                </a>
              </span>
            </div>
          </Col>

          <Col lg="12" className=" mt-4 text-center">
            <p className="copyright">
            Copyright, All rights reserved Ouranos LLC.   2022

            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;