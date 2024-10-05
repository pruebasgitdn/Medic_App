import React, { useContext } from "react";
import { Context } from "../main";
import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;
import {
  UserOutlined,
  SettingOutlined,
  FileOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  HistoryOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const UserPanel = () => {
  // const { isAuthenticated, user } = useContext(Context);

  return (
    <Layout>
      <Sider collapsible theme="light">
        <Menu mode="inline">
          {/* Añadir enlaces de las rutas a los items del menú */}
          <Menu.Item key="1" icon={<ProfileOutlined />}>
            <Link to="profile">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            <Link to="appointment">Agendar Cita</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<HistoryOutlined />}>
            <Link to="history">Ver Historial</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            <Link to="appointments">Ver Citas</Link>
          </Menu.Item>
          {/* Otras opciones del menú */}
          <Menu.Item key="6" icon={<SettingOutlined />}>
            Notificaciones
          </Menu.Item>

          <Menu.Item key="8" icon={<QuestionCircleOutlined />}>
            Solicitar Soporte
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

export default UserPanel;
