import React, { useContext } from "react";
import { Context } from "../main";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Menu,
  Calendar,
} from "antd";
const { Header, Sider, Content } = Layout;
import {
  UserOutlined,
  SettingOutlined,
  FileOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import PatientHistory from "../pages/PatientHistory";
import Profile from "../pages/Profile";

// // Datos de ejemplo para el gráfico
// const data = [
//   { name: "PENDIENTES", value: 400 },
//   { name: "RELIZADAS", value: 300 },
//   { name: "CANCELADAS", value: 300 },
// ];
// const dataa = [
//   { month: "Enero", citas: 5 },
//   { month: "Febrero", citas: 8 },
//   { month: "Marzo", citas: 12 },
//   { month: "Abril", citas: 6 },
//   { month: "Mayo", citas: 10 },
//   { month: "Junio", citas: 9 },
//   { month: "Julio", citas: 7 },
//   { month: "Agosto", citas: 11 },
//   { month: "Septiembre", citas: 4 },
//   { month: "Octubre", citas: 13 },
//   { month: "Noviembre", citas: 5 },
//   { month: "Diciembre", citas: 14 },
// ];

// const dataaa = [
//   { month: "Enero", cost: 50.0 },
//   { month: "Febrero", cost: 80.0 },
//   { month: "Marzo", cost: 12.0 },
//   { month: "Abril", cost: 60.0 },
//   { month: "Mayo", cost: 10.0 },
//   { month: "Junio", cost: 90.0 },
//   { month: "Julio", cost: 70.0 },
//   { month: "Agosto", cost: 11.0 },
//   { month: "Septiembre", cost: 40.0 },
//   { month: "Octubre", cost: 13.0 },
//   { month: "Noviembre", cost: 50.0 },
//   { month: "Diciembre", cost: 14.0 },
// ];

// // Colores para cada sección del gráfico
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserPanel = () => {
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
            Información del Paciente
          </Menu.Item>
          <Menu.Item key="6" icon={<SettingOutlined />}>
            Notificaciones
          </Menu.Item>
          <Menu.Item key="7" icon={<FileOutlined />}>
            Ver Documentos
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
              Agendar Cita
            </Button>
          </Link>
          <Link to="history">
            <Button type="primary" size="small" className="action-button">
              Ver Historial
            </Button>
          </Link>
          <Link to="appointments">
            <Button type="primary" size="small" className="action-button">
              Ver Citas
            </Button>
          </Link>
        </Header>
        <Content className="profile-content">
          {/* Outlet me renderiza las rutas hijas/anidadas en el app.jsx */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPanel;
