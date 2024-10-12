import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Row, Col, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Context } from "../main";
const { TextArea } = Input;
const { Dragger } = Upload;
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupportForm = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState([]);
  const [url, SetUrl] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file) => {
    setFile(file);
    return false;
  };

  useEffect(() => {
    if (user.role == "doctor") {
      SetUrl("http://localhost:4000/api/doctor/support");
    } else if (user.role == "paciente") {
      SetUrl("http://localhost:4000/api/patient/support");
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("asunto", values.asunto);
      formData.append("description", values.description);

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        url,
        formData,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Formulario enviado con éxito");
        setLoading(false);
        navigate("/");
        form.resetFields(); // Limpiar el formulario
        setFile(null); // Reiniciar el archivo
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar el formulario:", error);
      message.error("Error en la solicitud, intente nuevamente");
    }
  };

  return (
    <Row className="register-container">
      <Col xs={24} md={12}>
        <Card className="register-form-card">
        <div>
          such ni vokas
        </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            name="sform"
            className="form-item"
          >
            <Form.Item
              name="asunto"
              label="Asunto"
              className="form-item"
              rules={[
                { required: true, message: "Por favor ingrese el asunto" },
                {
                  min: 8,
                  message: "El asunto debe tener al menos 8 caracteres",
                },
              ]}
            >
              <Input placeholder="Ingrese el asunto de su solicitud" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descripción"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una descripción",
                },
                {
                  min: 8,
                  message: "Minimo 8 caracteres",
                },
                {
                  max: 150,
                  message: "Maximo 150 caracteres",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describa su problema o solicitud"
              />
            </Form.Item>

            <Form.Item
              name="file"
              label="Adjuntar archivo"
              className="form-item"
            >
              <Dragger name="file" beforeUpload={handleFileUpload}>
                <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <div className="btns_flex">
                <Button
                  block
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  form="sform"
                >
                  Enviar
                </Button>
                <Button block>
                  <Link to="/">Cancelar</Link>
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SupportForm;
