import React from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";

const ContactForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div className="login-container">
      <Card
        title="Formulario de Contacto"
        className="contact-card" // Clase personalizada
      >
        <Form
          form={form}
          name="contact-form"
          onFinish={onFinish}
          layout="vertical"
          className="contact-form" // Clase personalizada
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                  { required: true, message: "Por favor ingrese su nombre" },
                ]}
              >
                <Input placeholder="Ingrese su nombre" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Apellido"
                name="apellido"
                rules={[
                  { required: true, message: "Por favor ingrese su apellido" },
                ]}
              >
                <Input placeholder="Ingrese su apellido" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor ingrese su email" },
              { type: "email", message: "Por favor ingrese un email válido" },
            ]}
          >
            <Input placeholder="Ingrese su email" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su número de teléfono",
              },
              {
                pattern: /^\d{10}$/,
                message: "El número debe tener 10 dígitos",
              },
            ]}
          >
            <Input placeholder="Ingrese su número de teléfono" />
          </Form.Item>

          <Form.Item
            label="Mensaje"
            name="mensaje"
            rules={[
              { required: true, message: "Por favor ingrese su mensaje" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Ingrese su mensaje" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;
