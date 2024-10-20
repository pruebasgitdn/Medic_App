import React, { useContext, useEffect } from "react";
import { Card, Button, Avatar, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Context } from "../main";
import { MailTwoTone, EditOutlined, UserAddOutlined } from "@ant-design/icons";
const AdminProfile = () => {
  const { user } = useContext(Context);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
      <Col xs={22} sm={18} md={12} lg={8}>
        <Card
          className="user-profile-card"
          style={{ textAlign: "center", borderRadius: "10px" }}
        >
          {/* Imagen de Avatar */}
          <Avatar
            size={150}
            style={{ marginBottom: "20px" }}
            src={user?.photo?.url}
          />

          {/* Información del Usuario */}

          <div className="card_info_ur">
            <h4>Adminstrador. {user.nombre}</h4>

            <p>
              <MailTwoTone />
              {user.email}
            </p>
          </div>
          {/* Botones de Acciones */}
          <div className="adminperfil_btns">
            <Link to="/adminpanel/editprofile">
              <Button block type="primary" icon={<EditOutlined />}>
                Editar Perfil
              </Button>
            </Link>
            <Link to="/adminpanel/newadmin">
              <Button icon={<UserAddOutlined />} block>
                Añadir Admin
              </Button>
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminProfile;
