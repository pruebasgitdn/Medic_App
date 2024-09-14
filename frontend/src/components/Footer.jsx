import React from "react";
import { Row, Col } from "antd";

const FooterCm = () => {
  return (
    <Row gutter={[32, 16]} className="ft" justify="center">
      <Col xs={24} md={4} className="col">
        <div>
          <img src="/logos/mainblack.png" alt="" width="200px" />
        </div>
        <div className="fticons">
          <span>
            <img src="/logos/mainblack.png" alt="" width="80px" />
          </span>
          <span>
            <img src="/logos/mainblack.png" alt="" width="80px" />
          </span>
        </div>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>Paciente</h3>
        <ul>
          <li>Iniciar Sesion</li>
          <li>Registro</li>
          <li>Metodos de pago</li>
        </ul>
      </Col>
      <Col xs={24} md={4} className="col">
        <h3>Medico</h3>
        <ul>
          <li>Iniciar Sesion</li>
          <li>Quieres ser parte?</li>
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
          <li>Registarme</li>
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
