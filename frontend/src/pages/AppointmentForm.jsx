import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  message,
  Avatar,
} from "antd";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const AppointmentForm = () => {
  const [form] = Form.useForm();
  const [doctores, setDoctores] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/patient/appointmentoday",
          {
            withCredentials: true,
          }
        );

        const appointments = response.data.appointments;

        // sort las compara en comparacion a un objeto date etnoces tan
        const sortedAppointments = appointments.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );
        setAppointments(sortedAppointments);
        console.log(appointments);
      } catch (error) {
        console.log("Error al obtener las citas de hoy:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/patient/getDoctors",
          {
            withCredentials: true,
          }
        );

        const activos = response.data.doctors;
        const filtered = activos.filter((doctor) => doctor.estado === "activo");

        setDoctores(filtered);
      } catch (error) {
        console.error("Error al obtener los doctores:", error);
      } finally {
        setLoading(false);
      }
    };
    startDate.setSeconds(0);
    fetchDoctors();
  }, [form]);

  const onFinish = async (values) => {
    const fechaISO = startDate.toISOString(); // Formato ISO 8601

    const { motivo, detallesAdicionales, doctor } = values;

    //Crear objeto para cita
    const citaData = {
      fecha: fechaISO,
      motivo: motivo,
      idDoctor: doctor,
      detallesAdicionales: detallesAdicionales,
    };

    try {
      setLoading(true);

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
      setLoading(false);
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
      console.error("Error al crear la cita:", error);
      message.error(error.response?.data?.message || "Error al crear la cita."); // Notificación de error
      setLoading(false);
    }

    console.log("Formulario enviado:", citaData);
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Row gutter={[1, 1]} className="cont_apform">
        <Col xs={24} md={16}>
          <Card title="Agendar Cita" className="nooverflow form_card">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Doctor"
                name="doctor"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecciona un doctor",
                  },
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
                      {doctor.nombre} {doctor.apellido_pat}{" "}
                      <Avatar size={20} src={doctor?.photo?.url || "nn"} />{" "}
                      {doctor.especialidad}
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

              <Row className="centere">
                <h4>Fecha: </h4>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeInput
                />
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  block
                  size="small"
                >
                  Agendar Cita
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            size="100"
            className="citas_hoy"
            title={`Citas para hoy: ${new Date().toLocaleDateString()}`}
          >
            {appointments.length === 0 ? (
              <p>En el día de hoy no se registran citas.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="sendmain_btns">
                  <p>
                    <strong>Fecha: </strong>{" "}
                    {new Date(appointment.fecha).toLocaleString()}
                    <ClockCircleOutlined
                      style={{
                        color: "#f5222d",
                      }}
                    />
                  </p>

                  <hr />
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentForm;
