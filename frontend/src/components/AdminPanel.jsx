import React from "react";
import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ContactsOutlined,
  MessageOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const AdminPanel = () => {
  return (
    <Layout>
      <Sider collapsible theme="light">
        <Menu mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="profile">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link to="newdoctor">Doctores</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ContactsOutlined />}>
            <Link to="patients">Pacientes</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<MessageOutlined />}>
            <Link to="messages">Mensajes</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            <Link to="appointments">Citas</Link>
          </Menu.Item>
          <Menu.Item key="23" icon={<ToolOutlined />}>
            <Link to="support">Soporte</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content className="profile-content" style={{ padding: "24px" }}>
          {/* Renderizado de las rutas hijas */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
