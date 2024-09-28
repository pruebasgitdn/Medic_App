import React, { useContext } from "react";
import { Context } from "../main";
import { Layout, Button, Menu } from "antd";
const { Header, Sider, Content } = Layout;
import {
  UserOutlined,
  SettingOutlined,
  FileOutlined,
  QuestionCircleOutlined,
  InsertRowAboveOutlined,
} from "@ant-design/icons";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

const DoctorPanel = () => {
  const { isAuthenticated, user } = useContext(Context);

  return (
    <Layout className="panel">
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="sidebar-menu"
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            Información del Doctor
          </Menu.Item>
          <Menu.Item key="6" icon={<SettingOutlined />}>
            Notificaciones
          </Menu.Item>
          <Menu.Item key="7" icon={<FileOutlined />}>
            Ver Documentos
          </Menu.Item>
          <Menu.Item key="8" icon={<InsertRowAboveOutlined />}>
            Estadisticas
          </Menu.Item>
          <Menu.Item key="8" icon={<QuestionCircleOutlined />}>
            Solicitar Soporte
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="profile-header">
          {/* Enlaces para las rutas */}
          <Link to="profile">
            <Button type="primary" size="small" className="action-button">
              Perfil
            </Button>
          </Link>
          <Link to="appointment">
            <Button type="primary" size="small" className="action-button">
              Atender mis Citas
            </Button>
          </Link>
          <Link to="history">
            <Button type="primary" size="small" className="action-button">
              Gestionar Pacientes
            </Button>
          </Link>

          <Link to="history">
            <Button type="primary" size="small" className="action-button">
              Gestionar Citas
            </Button>
          </Link>
          <Link to="history">
            <Button type="primary" size="small" className="action-button">
              Historial
            </Button>
          </Link>
          <Link to="history">
            <Button type="primary" size="small" className="action-button">
              Reporte
            </Button>
          </Link>
        </Header>
        <Content className="profile-content">
          {/* Outlet me renderiza las rutas hijas/anidadas en el app.jsx */}
          <div>calendario(agenda) reporte(boton generar reoprte)</div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorPanel;
