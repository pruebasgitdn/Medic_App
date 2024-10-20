import React, { useEffect, useState } from "react";
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
} from "antd";
const { Option } = Select;

const PatientAppointments = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendientes, setPendientes] = useState("recent");
  const [realizadas, setRealizadas] = useState("recent");

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
      message.error("Error al cancelar la cita", error);
    }

    console.log(id);
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
          <Option value="recent">Recientes</Option>
          <Option value="oldest">Antiguas</Option>
        </Select>
        {sortedPendientes.length > 0 ? (
          sortedPendientes.map((cita, index) => (
            <Card
              key={index}
              title={`Cita ${index + 1}`}
              bordered={false}
              className="card_adv"
            >
              <p>
                <strong>Motivo:</strong> {cita.motivo}
              </p>
              <p>
                <strong>Doctor:</strong>{" "}
                {`${cita.idDoctor.nombre} ${cita.idDoctor.apellido_pat} ${cita.idDoctor.apellido_mat}`}
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
                <strong>Detalles:</strong> {cita.detallesAdicionales}
              </p>

              <div className="nooverflow">
                <Popconfirm
                  title="¿Estás seguro de que quieres eliminar esta cita?"
                  okText="Sí"
                  onConfirm={() => handleCancel(cita)}
                  cancelText="No"
                >
                  <Button danger block size="small" type="primary">
                    Cancelar cita
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))
        ) : (
          <Alert message="No tienes citas pendientes." type="info" />
        )}
      </Col>

      {/* Sección de Citas Realizadas */}
      <Col span={12}>
        <h2 className="nooverflow">Citas Realizadas</h2>
        <Select
          defaultValue={realizadas}
          style={{ width: 200, marginBottom: "16px" }}
          onChange={(value) => setRealizadas(value)}
        >
          <Option value="recent">Recientes</Option>
          <Option value="oldest">Antiguas</Option>
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
                  className="card_adv"
                >
                  <p>
                    <strong>Motivo:</strong> {cita.motivo}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {`${cita.idDoctor.nombre} ${cita.idDoctor.apellido_pat} ${cita.idDoctor.apellido_mat}`}
                  </p>
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
