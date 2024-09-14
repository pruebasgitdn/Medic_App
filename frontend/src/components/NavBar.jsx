import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

const NavBar = () => {
  return (
    <Menu mode="horizontal" className="navbar">
      <div>
        <img src="/logos/logomain.png" alt="" width="140px" />
      </div>
      <Menu.Item key="1">
        <Link to="/">Inicio</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/about">Nosotros</Link>
      </Menu.Item>
      <Menu.SubMenu key="3" title="Contacto">
        <Menu.Item key="sub1">
          <Link to="/contact/subpage1">SubPage 1</Link>
        </Menu.Item>
        <Menu.Item key="sub2">
          <Link to="/contact/subpage2">SubPage 2</Link>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default NavBar;
