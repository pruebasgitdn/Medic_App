import React, { useContext } from "react";
import { Card, Button, Avatar, Row, Col } from "antd";
import { EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Context } from "../main";
import { CalendarTwoTone, PhoneTwoTone, MailTwoTone } from "@ant-design/icons";

const Profile = () => {
  const { user } = useContext(Context);

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
            src={user?.photo?.url ? user?.photo?.url : {}} // Usar la URL de la foto del usuario
          />

          {/* Información del Usuario */}

          <div className="card_info_user">
            <h4>
              {user.nombre} {user.apellido_pat}
            </h4>
            <p>
              <MailTwoTone />
              {user.email}
            </p>
            <p>
              <PhoneTwoTone />
              {user.telefono}
            </p>
            <p>
              <CalendarTwoTone />
              {user ? new Date(user?.dot).toLocaleDateString() : "15/23/2004"}
            </p>
          </div>
          {/* Botones de Acciones */}
          <div className="card_btn_user">
            <Link to="/userpanel/history">
              <Button
                type="primary"
                icon={<HistoryOutlined />}
                style={{ marginRight: "10px" }}
              >
                Ver Historial
              </Button>
            </Link>
            <Link to="/userpanel/editprofile">
              <Button icon={<EditOutlined />}>Editar Perfil</Button>
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
