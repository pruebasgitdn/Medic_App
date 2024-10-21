import React from "react";
import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;
import {
  UserOutlined,
  InsertRowAboveOutlined,
  CalendarOutlined,
  HistoryOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const DoctorPanel = () => {
  return (
    <Layout>
      <Sider collapsible theme="light">
        <Menu mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="profile">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            <Link to="appointments">Atender Citas</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="/doctorpanel/patients">Pacientes</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<HistoryOutlined />}>
            <Link to="history">Historial</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<ToolOutlined />}>
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

export default DoctorPanel;
