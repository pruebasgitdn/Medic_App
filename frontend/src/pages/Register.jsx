import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

import {
  Form,
  Input,
  Card,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Upload,
} from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;


//FORM DATA
// const [nombre,setNombre] = useState("")
// const [email,setEmail] = useState("")
// const [apellido_pat,setApellido_pat] = useState("")
// const [apellido_mat,setApellido_mat] = useState("")
// const [password,setPassword] = useState("")
// const [phone,setPhone] = useState("")
// const [dot,setDot] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")
// const [nombre,setNombre] = useState("")

const Register = () => {

  const [form] = Form.useForm();

  const handeRegister = async (values) => {
    console.log(values)
  }


  return (
    <Row className="register-container">
      {/* Columna del formulario */}
      <Col xs={24} md={16} className="form-column">
        <Card className="register-form-card">
          <Form layout="vertical"
            form={form}
            onFinish={handeRegister}
          >
            <Row gutter={10}>
              <Col span={24}>
                <h4>Información Personal</h4>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Nombre" name="nombre">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Foto" name="photo">
                <Upload>
                    <Button icon={<UploadOutlined/>}> Foto</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Apellido Paterno" name="apellido_pat">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Apellido Materno" name="apellido_mat">
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Contraseña" name="contraseña">
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Teléfono" name="telefono">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Fecha de Nacimiento" name="dot">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Género" name="genero">
                  <Select>
                    <Option value="hombre">Hombre</Option>
                    <Option value="mujer">Mujer</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <h4>Información Medica</h4>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Tipo de documento" name="document_type">
                  <Select>
                    <Option value="cc">CC</Option>
                    <Option value="nit">NIT</Option>
                    <Option value="pasaporte">Pasaporte</Option>
                    <Option value="otro">Otro</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Documento de identificacion" name="documet_file">
                  <Upload>
                    <Button icon={<UploadOutlined/>}> Documento</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Número de Contacto de Emergencia"
                  name="numero_contacto_emergencia"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre de Contacto de Emergencia"
                  name="contacto_emergencia"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Proveedor de Seguros"
                  name="proveedor_seguros"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Dirección" name="direccion">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" block>
              Registrar
            </Button>
            <div className="btnregister">
              <Button type="dashed" block>
                Inicio
              </Button>
              <Button type="dashed"  block>
                Login
              </Button>
            </div>
          </Form>
        </Card>
      </Col>

      {/* Columna de la imagen */}
      <Col xs={0} md={8} className="image-column">
        <img
          src="/asideregister.jpg"
          alt="Banner"
          className="register-banner"
        />
      </Col>
    </Row>
  );
};

export default Register;
