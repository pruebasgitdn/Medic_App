import { Row, Col, Card } from "antd";

const Advantages = () => {
  return (
    <div className="container">
      <div className="advantages">
        <h3>Todo lo necesario para ofrecer el mejor servicio en linea.</h3>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card bordered={true} className="card_adv">
              <div>
                <img src="/advantages/alarm.png" alt="" width={"40px"} />
                <h4>Recordatorios automatizados</h4>
              </div>
              <p>
                Tus pacientes recibirán mensajes para recordarles que tienen
                consulta en línea contigo. Y, además, también recibirán un
                mensaje al final de la cita para que escriban una opinión sobre
                tu servicio.
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true} className="card_adv">
              <div>
                <img src="/advantages/eye.png" alt="" width={"40px"} />
                <h4>Consultas</h4>
              </div>
              <p>
                Tus pacientes recibirán mensajes para recordarles que tienen
                consulta en línea contigo. Y, además, también recibirán un
                mensaje al final de la cita para que escriban una opinión sobre
                tu servicio.
              </p>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card bordered={true} className="card_adv">
              <div>
                <img src="/advantages/care.png" alt="" width={"40px"} />
                <h4>Ambiente amigable e intuitivo</h4>
              </div>
              <p>
                Tus pacientes recibirán mensajes para recordarles que tienen
                consulta en línea contigo. Y, además, también recibirán un
                mensaje al final de la cita para que escriban una opinión sobre
                tu servicio.
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true} className="card_adv">
              <div>
                <img src="/advantages/key.png" alt="" width={"40px"} />
                <h4>Seguridad</h4>
              </div>
              <p>
                Tus pacientes recibirán mensajes para recordarles que tienen
                consulta en línea contigo. Y, además, también recibirán un
                mensaje al final de la cita para que escriban una opinión sobre
                tu servicio.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Advantages;
