import { useContext, useEffect } from "react";
import { Card, Button, Avatar, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Context } from "../main";
import {
  CalendarTwoTone,
  PhoneTwoTone,
  MailTwoTone,
  EditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const DoctorProfile = () => {
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

          <div className="card_info_user">
            <div className="dblock">
              <h4>
                Dr.{user.nombre} {user.apellido_pat}
              </h4>
              <h4>Especialista: {user.especialidad}</h4>
              <h4>Licencia: {user.numero_licencia}</h4>

              <p>
                <MailTwoTone /> {user.email}
              </p>
              <p>
                <PhoneTwoTone />
                {user.telefono}
              </p>
              <p>
                <CalendarTwoTone />
                {user && user.dot?.length > 0
                  ? new Date(user?.dot).toLocaleDateString()
                  : "15/23/2004"}
              </p>
            </div>
          </div>
          {/* Botones de Acciones */}
          <div className="adminperfil_btns">
            <Link to="/doctorpanel/history">
              <Button
                type="primary"
                block
                icon={<HistoryOutlined />}
                style={{ marginRight: "10px" }}
              >
                Ver Historial
              </Button>
            </Link>
            <Link to="/doctorpanel/editprofile">
              <Button block icon={<EditOutlined />}>
                Editar Perfil
              </Button>
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DoctorProfile;
