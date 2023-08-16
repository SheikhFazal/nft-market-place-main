import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { Container } from "reactstrap";
import images from "../../assets/images/kk.png"
import { NavLink, Link } from "react-router-dom";
import { DragSwitch } from 'react-dragswitch'
import 'react-dragswitch/dist/index.css'
const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  {
    display: "Dashboard",
    url: "/dashboard",
  },
  {
    display: "How it works ?",
    url: "/work",
  },
];

const Header = (props) => {
  const headerRef = useRef(null);
  const [checked, setChecked] = useState(false)
  const menuRef = useRef(null);


  useEffect(() => {
    props.toogleTheme()
  }, [checked]);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });

    return () => {
      window.removeEventListener("scroll");
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <span>
              <img src={images} width="100" height="100" alt="Logo" />
            </span>


          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
              <DragSwitch checked={checked} onColor="black" onChange={(e) => {
                setChecked(e)
              }} />
            </ul>
          </div>

        </div>
      </Container>
    </header>
  );
};

export default Header;
