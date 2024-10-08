import React from "react";
import { Row, Col } from "antd";
import {
  FacebookFilled,
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const FooterCm = () => {
  return (
    <Row gutter={[32, 16]} className="ft" justify="center">
      <Col xs={24} md={4} className="col">
        <div>
          <img src="/logos/mainblack.png" alt="" className="img_footer" />
        </div>
        <div className="fticons">
          {/* <span>
            <img src="/logos/mainblack.png" alt="" width="80px" />
          </span> */}

          <FacebookOutlined className="icons_ftr" />
          <InstagramOutlined className="icons_ftr" />
          <MailOutlined className="icons_ftr" />
        </div>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>Paciente</h3>
        <ul>
          <Link to="/patientlogin">
            <li>Iniciar sesion</li>
          </Link>
          <Link to="/patientregister">
            <li>Registrarse</li>
          </Link>
          <li>Metodos de pago</li>
        </ul>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>Medico</h3>
        <ul>
          <Link to="/doctorlogin">
            <li>Iniciar sesion</li>
          </Link>
          <Link to="/contact">
            <li>Quieres ser parte?</li>
          </Link>
        </ul>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>Contacto</h3>
        <ul>
          <li>contacto@medlink.com</li>
          <li>312323122</li>
          <li>305234433</li>
        </ul>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>MEDELINK</h3>
        <ul>
          <li>Quines somos.</li>
          <li>Proteccion de datos.</li>
          <Link to="/patientregister">
            <li>Registarme</li>
          </Link>
        </ul>
      </Col>

      <div
        style={{
          background: "#e5e5e5",
          width: "100%",
          textAlign: "center",
        }}
      >
        COPY
      </div>
    </Row>
  );
};

export default FooterCm;
