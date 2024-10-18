import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Form,
  List,
  message,
  Input,
  Row,
  Col,
  Select,
  Modal,
} from "antd";

const { Option } = Select;
const { TextArea } = Input;

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [detallesDiagnostico, setDetallesDiagnostico] = useState("");
  const [citaId, setCitaId] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [order, setOrder] = useState("recent");
  const navigate = useNavigate(); //navigate como Navigate mehtod
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/appointments",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const pendientes = response.data.appointments.filter(
            (appointment) => appointment.estado === "PENDIENTE"
          );
          setAppointments(pendientes);
        } else {
          message.error("No se encontraron citas para el doctor.");
        }
      } catch (error) {
        console.log(error);
        message.error("No se encontraron citas.");
      }
    };
    fetchAppointment();
  }, []);

  //Obtengo el id de la cita
  const getAppointmentId = async (item) => {
    const id = item._id;
    if (id) {
      setCitaId(id); // Asegúrate de que el id se asigna correctamente
    } else {
      console.error("ID no válido para la cita.");
    }
  };

  const onFinish = async () => {
    console.log("diagnostico", detallesDiagnostico);
    console.log("recomendaciones", recomendaciones);
    console.log("Id cita", citaId);

    if (!detallesDiagnostico || !recomendaciones) {
      message.error(
        "Ambos campos, Diagnóstico y Recomendaciones, son requeridos."
      );
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/appointment/respond/${citaId}`,
        {
          recomendaciones,
          detallesDiagnostico,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success("Cita Realiza con exito!!");
        navigate("/doctorpanel/history");
      }
    } catch (error) {
      message.error("Error en dar Respuesta al Paciente");
      console.error("Error:", error);
    }
  };

  const ordenarCitas = (a, b) => {
    if (order === "recent") {
      return new Date(a.fecha) - new Date(b.fecha); // De más reciente a más antiguo
    } else {
      return new Date(b.fecha) - new Date(a.fecha); // De más antiguo a más reciente
    }
  };
  const citasOrdenadas = [...appointments].sort(ordenarCitas);

  //Abrir MOdal
  const handleModal = () => {
    setIsModalVisible(true);
  };

  // Cierra el modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelarCita = async () => {
    try {
      setLoading(true);
      if (!motivoCancelacion) {
        message.error("Por favor, ingresa el motivo de la cancelación.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/api/doctor/appointment/cancel/${citaId}`,
        { motivoCancelacion },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Cita cancelada exitosamente.");
        navigate("/doctorpanel/profile");
        setIsModalVisible(false);
      }
      setLoading(false);
    } catch (error) {
      message.error("Error al cancelar la cita.");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  console.log(citaId);
  return (
    <div>
      <h2 className="nooverflow">Citas Proximas y Agendadas</h2>
      <Select
        value={order}
        onChange={(value) => setOrder(value)}
        style={{ width: 200, marginBottom: "16px" }}
      >
        <Option value="recent">Recientes</Option>
        <Option value="oldest">Antiguas</Option>
      </Select>
      {citasOrdenadas.length > 0 ? (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 10,
          }}
          dataSource={citasOrdenadas}
          renderItem={(appointment) => (
            <List.Item key={appointment._id}>
              <Card
                title={`Paciente: ${appointment?.idPaciente?.nombre || "N/A"} ${
                  appointment?.idPaciente?.apellido_pat || "N/A"
                }`}
              >
                <Row>
                  <Col span={12}>
                    <div className="doctorpatient_img">
                      <img
                        src={appointment?.idPaciente?.photo?.url || {}}
                        alt="patient"
                      />
                      <div className="flex_col">
                        <p>
                          <strong>Estado:</strong>{" "}
                          {appointment?.estado || "N/A"}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {new Date(appointment?.fecha).toLocaleDateString() ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Hora:</strong>{" "}
                          {new Date(appointment?.fecha).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) || "N/A"}
                        </p>
                        <p>
                          <strong>Motivo:</strong>{" "}
                          {appointment?.motivo || "N/A"}
                        </p>
                        <p>
                          <strong>Detalles Adicionales:</strong>
                          <br />
                          {appointment?.detallesAdicionales || "N/A"}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Form name="responsedr" form={form} onFinish={onFinish}>
                      <Form.Item
                        label="Diagnostico"
                        className="form-item"
                        name="responsedr"
                        rules={[
                          {
                            max: 150,
                            message: "Requerido, y máximo 150 caracteres",
                          },
                          {
                            required: true,
                            message: "Requerido",
                          },
                        ]}
                      >
                        <TextArea
                          rows={3}
                          placeholder="Diagnosticar paciente"
                          onChange={(e) =>
                            setDetallesDiagnostico(e.target.value)
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label="Recomendaciones"
                        className="form-item"
                        name="recomendaciones"
                        rules={[
                          {
                            max: 150,
                            message: "Requerido, y máximo 150 caracteres",
                          },
                          {
                            required: true,
                            message: "Requerido",
                          },
                        ]}
                      >
                        <TextArea
                          rows={3}
                          placeholder="..."
                          onChange={(e) => setRecomendaciones(e.target.value)}
                        />
                      </Form.Item>
                      <div className="btns_responder">
                        <Button
                          block
                          size="small"
                          htmlType="submit"
                          type="primary"
                          className="btn_responder"
                          onClick={() => getAppointmentId(appointment)}
                        >
                          Responder
                        </Button>
                        <Button
                          danger
                          size="small"
                          type="primary"
                          block
                          onClick={() => {
                            getAppointmentId(appointment);
                            handleModal();
                          }}
                        >
                          Cancelar Cita
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card title="No tienes citas agendadas de momento!" />
      )}

      <Modal
        open={isModalVisible}
        title="Cancelar Cita"
        onCancel={handleCancel}
        footer={[]}
      >
        <p id="no_img_supp">
          En caso de que requiera cancelar la cita, deberá notificar al paciente
          el motivo o razon por el cual lo hizo para que el paciente pueda tomar
          acciones oportunas.
        </p>
        <br />
        <hr />
        <br />
        <Form>
          <Form.Item
            className="form-item"
            name="cancelacion_motivo"
            label="Motivo"
            rules={[
              {
                required: true,
                message: "Requerido",
              },
              {
                max: 200,
                message: "Maximo 200 caracteres",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Explica al paciente el motivo de la cancelacion de la cita"
              onChange={(e) => setMotivoCancelacion(e.target.value)}
            />

            <div className="btns_flex">
              <Button
                block
                danger
                size="small"
                loading={loading}
                onClick={() => handleCancelarCita()}
              >
                Confirmar
              </Button>
              <Button
                type="dashed"
                block
                size="small"
                onClick={() => handleCancel()}
              >
                Salir
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
