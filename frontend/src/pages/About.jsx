import React from "react";
import { Row, Col, Image, Card, Button } from "antd";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-container">
      <Row className="about-content">
        <Card>
          <Col className="about-text ">
            <h2 className="nooverflow">Acerca de Link-CARE</h2>
            <p>
              Link-CARE te ofrece los mejores servicios con los especialistas en
              diversas ramas de la salud. Nuestro equipo de profesionales está
              comprometido en brindar el mejor servicio y atención personalizada
              a cada paciente. En Link-CARE, nuestra prioridad son los
              pacientes.
            </p>
          </Col>
          <Col>
            <img
              src="/red.png"
              alt="Equipo de Link-CARE"
              className="about-image"
            />
            <br />
            <Button block type="primary">
              <Link to="/contact">Contactanos!</Link>
            </Button>
          </Col>
        </Card>
      </Row>
    </div>
  );
};

export default About;
