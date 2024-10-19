import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Row,
  Col,
  message,
} from "antd";
import axios from "axios";

const { Option } = Select;

const AppointmentForm = () => {
  const [form] = Form.useForm();
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/patient/getDoctors",
          {
            withCredentials: true,
          }
        );
        setDoctores(response.data.doctors);
      } catch (error) {
        console.error("Error al obtener los doctores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  //El values del userForm del ant nos permite acceder a los valores de los name de los input del form de antdesign
  const onFinish = async (values) => {
    // Formato del input fecha para enviarla en el formato adecuado (el Date Picker)
    const fechaISO = values.fecha.format(); // Formato ISO 8601
    const { motivo, detallesAdicionales, doctor } = values;

    //Crear objeto para cita
    const citaData = {
      fecha: fechaISO,
      motivo: motivo,
      idDoctor: doctor,
      detallesAdicionales: detallesAdicionales,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/appointment/post",
        citaData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        form.resetFields(); //Resetear campos
        message.success("Cita agendada exitosamente!!");
        navigate("/userpanel/appointments");
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      message.error(error.response?.data?.message || "Error al crear la cita."); // Notificación de error
    }

    console.log("Formulario enviado:", values);
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Card
        title="Agendar Cita"
        style={{ maxWidth: "600px", margin: "0 auto" }}
        className="nooverflow"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Doctor"
            name="doctor"
            rules={[
              { required: true, message: "Por favor, selecciona un doctor" },
            ]}
            className="form-item"
          >
            <Select
              placeholder="Selecciona un doctor"
              loading={loading}
              className="nooverflow"
            >
              {doctores.map((doctor) => (
                <Option key={doctor._id} value={doctor._id}>
                  {doctor.nombre} {doctor.apellido_pat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Motivo de la Cita"
                name="motivo"
                className="form-item"
                rules={[
                  {
                    min: 8,
                    required: true,
                    message: "Requerido, minimo 8 caracteres",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe el motivo de la cita minimo 8 caracteres"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Notas adicionales"
                name="detallesAdicionales"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Por favor, agrega algunas notas adicionales",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Agregar notas adicionales"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Fecha de la Cita"
            name="fecha"
            className="form-item"
            id="containerpicker"
            rules={[
              { required: true, message: "Por favor, selecciona una fecha" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DDTHH:mm:ss" //ISO
              showTime
              placeholder="Seleccione una fecha y hora"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Agendar Cita
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AppointmentForm;
