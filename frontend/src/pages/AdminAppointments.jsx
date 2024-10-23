import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Card,
  Popconfirm,
  message,
  Row,
  Col,
  Select,
  Input,
  Form,
  Avatar,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [state, setState] = useState("TODAS");
  const [order, setOrder] = useState("recent");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admin/appointments",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAppointments(response.data.citas);
      setFilteredAppointments(response.data.citas);
      setLoading(false);
    } catch (error) {
      message.error("No se encontraron citas.");
      setLoading(false);
      console.log(error);
    }
    console.log(appointments);
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const filterAndSortAppointments = () => {
    //let, const no muy flexible
    let filtered = appointments;

    // Filtrar por estado valor
    if (state !== "TODAS") {
      filtered = appointments.filter(
        (appointment) => appointment.estado === state
      );
    }

    // Ordenar por estado fecha
    if (order === "recent") {
      filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Orden descendente
    } else {
      filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden ascendente
    }

    //Y seteamos los filtrados con el filtro, que va en la fuente de datos de Table
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    filterAndSortAppointments();
  }, [appointments, state, order]);

  // Mostrar Abrir y cerrar
  const showDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
    setSelectedAppointment(null);
  };

  //Filtrar por estado
  const FilterStatus = (value) => {
    setState(value);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
  };

  const nashe = async (id) => {
    try {
      setLoading(true);

      if (!motivoCancelacion) {
        message.error("Por favor, ingresa el motivo de la cancelación.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/api/admin/appointment/cancel/${id}`,
        { motivoCancelacion },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Cita cancelada exitosamente.");
        navigate("/adminpanel/profile");
        setVisible(false);
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
      message.error("Error al cancelar la cita ");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/deleteappointment/${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        message.success("Cita eliminada correctamente");
        navigate("/adminpanel/profile");
        setFilteredAppointments((prev) =>
          prev.filter((cita) => cita._id !== id)
        );
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
      message.error("Error al eliminar la cita");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha) => new Date(fecha).toLocaleDateString(), // toLocaleDateString para la fecha
    },
    {
      title: "Hora",
      dataIndex: "fecha",
      key: "hora",
      render: (fecha) =>
        new Date(fecha).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), //  toLocaleTimeString para la hora
    },

    {
      title: "Doctor",
      //del id Pop¿ulando el nombre
      dataIndex: ["idDoctor", "email"],
      key: "doctor",
    },

    {
      title: "Paciente",
      dataIndex: ["idPaciente", "email"],
      key: "paciente",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (record) => (
        <>
          <Button type="link" onClick={() => showDetails(record)} size="small">
            Ver
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar esta cita?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Row style={{ marginBottom: "16px" }} gutter={16}>
        <Col>
          <Select
            defaultValue="recent"
            onChange={handleOrderChange}
            style={{ width: 180 }}
          >
            <Option value="recent">Más recientes</Option>
            <Option value="oldest">Más antiguas</Option>
          </Select>
        </Col>
        <Col>
          <Select
            //Valor por defecto en 'TODAS'
            defaultValue={state}
            onChange={FilterStatus}
            style={{ width: 180 }}
            allowClear
          >
            <Option value="TODAS">TODAS</Option>
            <Option value="PENDIENTE">PENDIENTE</Option>
            <Option value="REALIZADA">REALIZADA</Option>
            <Option value="CANCELADA">CANCELADA</Option>
          </Select>
        </Col>
      </Row>

      <h4 className="nooverflow">Administrar Citas </h4>
      <Table
        dataSource={filteredAppointments}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />

      {/* Modal para ver detalles */}
      <Modal
        open={visible}
        title="Detalles de la Cita"
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedAppointment && (
          <Card
            title={`FECHA: ${new Date(
              selectedAppointment.fecha
            ).toLocaleDateString()} - ${new Date(
              selectedAppointment.fecha
            ).toLocaleTimeString()}`}
          >
            <p>
              <strong>Estado:</strong> {selectedAppointment.estado}
            </p>

            <Row justify="space-between">
              <Col xs={24} md={12}>
                <p>
                  <strong>Dr:</strong>{" "}
                  <Avatar
                    src={selectedAppointment?.idDoctor?.photo?.url} // Mostrar la foto si existe
                    alt="Foto del Doctor"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                  <br /> {selectedAppointment.idDoctor.email}
                </p>
              </Col>
              <Col xs={24} md={12}>
                <p>
                  <strong>Paciente:</strong>{" "}
                  <Avatar
                    src={selectedAppointment?.idPaciente?.photo?.url} // Mostrar la foto si existe
                    alt="Foto del Doctor"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                  <br />
                  {selectedAppointment.idPaciente.email}
                </p>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col xs={24} md={12}>
                <p>
                  <strong>Motivo de la cita:</strong>
                  <br /> {selectedAppointment.motivo}
                </p>
              </Col>
              <Col xs={24} md={12}>
                <p>
                  <strong>Detalles Adicionales:</strong>
                  <br />
                  {selectedAppointment.detallesAdicionales}
                </p>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col xs={24} md={12}>
                <p>
                  <strong>Detalles del Diagnostico :</strong>
                  <br />
                  {selectedAppointment.detallesDiagnostico || "No disponibles"}
                </p>
              </Col>
              <Col xs={24} md={12}>
                <p>
                  <strong>Recomendaciones del Doctor:</strong>
                  <br />
                  {selectedAppointment.recomendaciones || "No disponibles"}
                </p>
              </Col>
            </Row>
            {selectedAppointment.estado === "PENDIENTE" ? (
              <>
                <div>
                  <p id="no_img_supp">
                    En caso de que requiera cancelar la cita, deberá notificar
                    al paciente el motivo o razon por el cual lo hizo para que
                    el paciente pueda tomar acciones oportunas.
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
                    </Form.Item>

                    <div className="btns_flex">
                      <Popconfirm
                        title="¿Estás seguro de que quieres cancelar esta cita?"
                        okText="Sí"
                        cancelText="No"
                        onConfirm={() => nashe(selectedAppointment._id)}
                      >
                        <Button block danger size="small" loading={loading}>
                          Cancelar
                        </Button>
                      </Popconfirm>

                      <Button
                        type="dashed"
                        block
                        size="small"
                        onClick={() => handleCancel()}
                      >
                        Salir
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            ) : (
              <></>
            )}
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default AdminAppointments;
