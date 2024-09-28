import React, { useContext } from "react";
import { Card, Button, Avatar, Row, Col } from "antd";
import { EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Context } from "../main";

const DoctorProfile = () => {
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
            src={user?.photo?.url} // Usar la URL de la foto del usuario
          />

          {/* Información del Usuario */}

          <div className="card_info_user">
            <h4>
              Dr. {user.nombre} {user.apellido_pat}
            </h4>
            <h4>Especialista: {user.especialidad}</h4>
            <p>{user.email}</p>
            <p>{user.telefono}</p>
            <p>15/23/2004</p>
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
            <Link to="/doctorpanel/editprofile">
              <Button icon={<EditOutlined />}>Editar Perfil</Button>
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DoctorProfile;
