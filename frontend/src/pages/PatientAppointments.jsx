import { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Alert,
  Button,
  message,
  Popconfirm,
  Select,
  List,
  Avatar,
  Modal,
  Input,
  Form,
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const { Option } = Select;
import {
  DeleteOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const PatientAppointments = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendientes, setPendientes] = useState("recent");
  const [realizadas, setRealizadas] = useState("recent");
  const [visible, setVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();

  const showAppointment = (cita) => {
    setVisible(true);
    setSelectedAppointment(cita);
    console.log(visible);
  };
  const closeAppointment = () => {
    setVisible(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/patient/appointments",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        if (data.success) {
          setHistorial(data.appointments);
        } else {
          console.log("No se encontraron citas");
          setHistorial([]);
        }
      } catch (err) {
        setError("No se encontraron citas agendadas del paciente", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filtrar por estado y ordenar dependiento del estado 'pendientes' o 'realizadas' que se setean con el set... de dropdown onclik set
  const sortedPendientes = historial
    .filter((cita) => cita.estado === "PENDIENTE")
    .sort((a, b) =>
      pendientes === "recent"
        ? new Date(b.fecha) - new Date(a.fecha)
        : new Date(a.fecha) - new Date(b.fecha)
    );

  const sortedRealizadas = historial
    .filter((cita) => cita.estado === "REALIZADA")
    .sort((a, b) =>
      realizadas === "recent"
        ? new Date(b.fecha) - new Date(a.fecha)
        : new Date(a.fecha) - new Date(b.fecha)
    );

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  const handleCancel = async (item) => {
    const id = item._id;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/appointment/cancel/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        message.success("Cita cancelada exitosamente");

        //actualizar estado para recargar componentes sin recargar la pagina
        setHistorial((prev) =>
          prev.map((c) => (c._id === id ? { ...c, estado: "CANCELADA" } : c))
        );
      } else {
        message.error("No se pudo cancelar la cita");
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        message.error(error.response.data.message || error.response.data);
      }
      message.error("Error al cancelar la cita", error);
    }

    console.log(id);
  };

  const handleEdit = async () => {
    const fecha = startDate.toISOString(); // Formato ISO 8601

    if (!fecha) {
      message.error("Para editar la cita porfavor envie una fecha");
      return;
    }

    try {
      setLoading(true);
      const payload = { fecha: startDate.toISOString() };
      const response = await axios.put(
        `http://localhost:4000/api/patient/editappointment/${selectedAppointment._id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        message.success("Fecha editada correctamente");
        navigate("/userpanel/appointment");
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
      message.error("Error editar la cita ");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <Row gutter={16}>
      {/* Sección de Citas Pendientes */}
      <Col span={12}>
        <h2 className="nooverflow">Citas Pendientes</h2>
        <Select
          defaultValue={pendientes}
          style={{ width: 200, marginBottom: "16px" }}
          onChange={(value) => setPendientes(value)}
        >
          <Option value="recent">Antiguas</Option>
          <Option value="oldest">Recientes</Option>
        </Select>
        {sortedPendientes.length > 0 ? (
          sortedPendientes.map((cita, index) => (
            <Card
              key={index}
              title={`Cita ${index + 1}`}
              bordered={false}
              className="card_appont"
            >
              <p>
                <strong>Motivo:</strong> {cita.motivo}
              </p>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {`${cita.idDoctor.nombre} ${cita.idDoctor.apellido_pat} ${cita.idDoctor.apellido_mat}`}
                  </p>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Avatar size={35} src={cita?.idDoctor?.photo?.url} />
                </Col>
              </Row>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(cita.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {new Date(cita.fecha).toLocaleTimeString()}
              </p>
              <p>
                <strong>Detalles:</strong> {cita.detallesAdicionales}
              </p>
              <div className="nooverflow btns_flex">
                <Popconfirm
                  title="¿Estás seguro de que quieres eliminar esta cita?"
                  okText="Sí"
                  onConfirm={() => handleCancel(cita)}
                  cancelText="No"
                >
                  <Button danger block size="small" type="primary">
                    Cancelar cita <DeleteOutlined />
                  </Button>
                </Popconfirm>
                <Button
                  onClick={() => showAppointment(cita)}
                  block
                  size="small"
                  type="primary"
                >
                  Modificar fecha <EditOutlined />
                </Button>
              </div>
              <Modal
                open={visible}
                title="Detalles de la Cita"
                onCancel={closeAppointment}
                footer={[]}
              >
                <Form className="modal_e" form={form} onFinish={handleEdit}>
                  <Form.Item name="motivo" label="Motivo">
                    <Input disabled placeholder={selectedAppointment?.motivo} />
                  </Form.Item>
                  <Row className="centere">
                    <h4>Fecha: </h4>

                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeInput
                    />

                    <p id="no_img_supp">
                      Re programe el día y la hora de su cita, si así lo
                      requiere.
                    </p>
                  </Row>

                  <Form.Item name="detalles" label="Detalles">
                    <Input.TextArea
                      placeholder={selectedAppointment?.detallesAdicionales}
                      rows={3}
                      disabled
                    />
                  </Form.Item>

                  <div className="btns_flex">
                    <Button
                      htmlType="submit"
                      size="small"
                      type="primary"
                      block
                      loading={loading}
                    >
                      Confirmar <CheckCircleOutlined />
                    </Button>
                    <Button
                      size="small"
                      danger
                      block
                      onClick={() => closeAppointment()}
                    >
                      Cancelar <CloseCircleOutlined />
                    </Button>
                  </div>
                </Form>
              </Modal>
            </Card>
          ))
        ) : (
          <Alert message="No tienes citas pendientes." type="info" />
        )}
      </Col>

      <></>

      {/* Sección de Citas Realizadas */}
      <Col span={12}>
        <h2 className="nooverflow">Citas Realizadas</h2>
        <Select
          defaultValue={realizadas}
          style={{ width: 200, marginBottom: "16px" }}
          onChange={(value) => setRealizadas(value)}
        >
          <Option value="recent">Antiguas</Option>
          <Option value="oldest">Recientes</Option>
        </Select>

        {sortedRealizadas.length > 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
            dataSource={sortedRealizadas}
            renderItem={(cita, index) => (
              <List.Item key={cita._id}>
                <Card
                  key={index}
                  title={`Cita ${index + 1}`}
                  bordered={false}
                  className="card_appont"
                >
                  <p>
                    <strong>Motivo:</strong> {cita.motivo}
                  </p>

                  <Row gutter={[0]}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <p>
                        <strong>Doctor:</strong>{" "}
                        {`${cita.idDoctor.nombre} ${cita.idDoctor.apellido_pat} ${cita.idDoctor.apellido_mat}`}
                      </p>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Avatar size={35} src={cita?.idDoctor?.photo?.url} />
                    </Col>
                  </Row>

                  <p>
                    <strong>Especialidad del Doctor:</strong>{" "}
                    {cita.idDoctor.especialidad}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(cita.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Hora:</strong>{" "}
                    {new Date(cita.fecha).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Detalles del Diagnóstico:</strong>{" "}
                    {cita.detallesDiagnostico}
                  </p>
                  <p>
                    <strong>Recomendaciones:</strong> {cita.recomendaciones}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Alert message="No tienes citas realizadas." type="info" />
        )}
      </Col>
    </Row>
  );
};

export default PatientAppointments;
