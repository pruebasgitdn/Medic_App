import { Card, Row } from "antd";

const DataProtection = () => {
  return (
    <div>
      <Row className="dp">
        <Card className="card_dp">
          <h4 className="nooverflow">Política de Protección de Datos</h4>
          <p>
            En <strong>Link-CARE</strong>, nos comprometemos a proteger la
            privacidad y seguridad de los datos personales de nuestros usuarios
            y pacientes. Este documento explica cómo recopilamos, usamos, y
            protegemos su información personal.
          </p>

          <h3>Recopilación de Datos</h3>
          <p>
            Los datos que recopilamos incluyen información básica de
            identificación personal, como su nombre, dirección, número de
            teléfono, dirección de correo electrónico, y cualquier dato de salud
            que sea relevante para ofrecerle los servicios médicos solicitados.
          </p>

          <h3>Uso de Datos</h3>
          <p>
            La información proporcionada se utilizará únicamente para gestionar
            sus citas médicas, realizar seguimientos clínicos, y enviar
            notificaciones relacionadas con su atención médica. En ningún caso
            compartiremos sus datos con terceros sin su consentimiento previo.
          </p>

          <h3>Seguridad de Datos</h3>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para
            garantizar la protección de su información contra accesos no
            autorizados, pérdida o modificación. Utilizamos sistemas encriptados
            para la transmisión de datos y el almacenamiento seguro de
            información médica.
          </p>

          <h3>Derechos del Usuario</h3>
          <p>
            Usted tiene derecho a acceder, modificar, y eliminar sus datos
            personales en cualquier momento. Para ejercer estos derechos, puede
            ponerse en contacto con nuestro equipo de soporte a través del
            correo electrónico: <strong>soporte@link-care.com</strong>.
          </p>

          <p>
            Si tiene alguna duda o inquietud sobre nuestra política de
            protección de datos, no dude en contactarnos.
          </p>
        </Card>
      </Row>
    </div>
  );
};

export default DataProtection;
