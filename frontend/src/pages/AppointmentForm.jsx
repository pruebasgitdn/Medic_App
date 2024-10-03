import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
} from "antd"; // Usamos Antd message para mostrar notificación
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const AppointmentForm = () => {
  const [form] = Form.useForm();
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); //navigate como Navigate mehtod

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/patient/getDoctors",
          {
            withCredentials: true,
          }
        );
        setDoctores(response.data.doctors); // Asumiendo que la respuesta es un array de doctores
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
    // Formatear el input de name fecha para enviarla en el formato adecuado (el Date Picker)
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

      //Si hay exito en la peticion
      if (response.data.success) {
        form.resetFields(); //Resetear campos
        message.success("Cita cancelada exitosamente");
        navigate("/userpanel/appointments");
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      toast.error(error.response?.data?.message || "Error al crear la cita."); // Notificación de error
    }

    console.log("Formulario enviado:", values);
  };

  return (
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
            {/* Al poner en value el ._id puedo acceder a todo el id del dr para mandar a la cira*/}
            {doctores.map((doctor) => (
              <Option key={doctor._id} value={doctor._id}>
                {doctor.nombre} {doctor.apellido_pat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Fecha de la Cita"
          name="fecha"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, selecciona una fecha" },
          ]}
        >
          <DatePicker
            format="YYYY-MM-DDTHH:mm:ssZ" //ISO
            showTime
            placeholder="Seleccione una fecha y hora"
            style={{ width: "100%" }}
          />
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

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Agendar Cita
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppointmentForm;
