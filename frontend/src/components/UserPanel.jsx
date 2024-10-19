import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  EyeOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const UserPanel = () => {
  return (
    <Layout>
      <Sider collapsible theme="light">
        <Menu mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="profile">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            <Link to="appointment">Agendar Cita</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<HistoryOutlined />}>
            <Link to="history">Ver Historial</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<EyeOutlined />}>
            <Link to="appointments">Ver Citas</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<ToolOutlined />}>
            <Link to="support">Solicitar Soporte</Link>
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
