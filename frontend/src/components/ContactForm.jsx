import { useState } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { message as tt } from "antd";

const ContactForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMesage] = useState("");

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/message/send",
        {
          firstName,
          lastName,
          email,
          phone,
          message,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        tt.success("Datos enviados correctamente!");
        navigate("/");
      }
    } catch (error) {
      tt.error("Error el en envio de Datos");
      console.error("Error:", error);
    }
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
                className="form-item"
                rules={[
                  { required: true, message: "Por favor ingrese su nombre" },
                  {
                    min: 3,
                    message: "Minimo 3 caracteres",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ingrese su nombre"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Apellido"
                name="apellido"
                className="form-item"
                rules={[
                  { required: true, message: "Por favor ingrese su apellido" },
                  {
                    min: 3,
                    message: "El apellido debe tener minimo 3 caracteres",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ingrese su apellido"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            className="form-item"
            rules={[
              { required: true, message: "Por favor ingrese su email" },
              { type: "email", message: "Por favor ingrese un email válido" },
            ]}
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su email"
            />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            className="form-item"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su número de teléfono",
              },
              {
                min: 10,
                message: "El número debe tener al menos 10 dígitos",
              },
              {
                max: 13,
                message: "El número debe tener al maximo 11 dígitos",
              },
            ]}
          >
            <Input
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingrese su número de teléfono"
            />
          </Form.Item>

          <Form.Item
            label="Mensaje"
            className="form-item"
            name="mensaje"
            rules={[
              { required: true, message: "Por favor ingrese su mensaje" },
              {
                max: 200,
                message: "Maximo 200 caracteres",
              },
            ]}
          >
            <Input.TextArea
              onChange={(e) => setMesage(e.target.value)}
              rows={4}
              placeholder="Ingrese su mensaje"
            />
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
