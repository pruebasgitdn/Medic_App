import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Card, Alert, Select, Row, Col } from "antd";

const { Option } = Select;

const DoctorHistory = () => {
  const [order, setOrder] = useState("recent");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/appointments",
          {
            withCredentials: true,
          }
        );

        setData(response.data.appointments);
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Filtramos las citas que están en estado 'REALIZADA'
  const citasRealizadas = data.filter((cita) => cita.estado === "REALIZADA");

  const ordenarCitas = (a, b) => {
    if (order === "recent") {
      return new Date(b.fecha) - new Date(a.fecha); // De más reciente a más antiguo
    } else {
      return new Date(a.fecha) - new Date(b.fecha); // De más antiguo a más reciente
    }
  };

  // Ordenar las citas
  const citasOrdenadas = [...citasRealizadas].sort(ordenarCitas);

  return (
    <div>
      <h2>Historial de Citas Realizadas</h2>
      <Select
        value={order}
        onChange={(value) => setOrder(value)}
        style={{ marginBottom: 16 }}
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
          renderItem={(cita) => (
            <List.Item>
              <Card
                title={`Paciente: ${cita?.idPaciente?.nombre || "N/A"} ${
                  cita?.idPaciente?.apellido_pat || "N/A"
                }`}
              >
                <Row gutter={20}>
                  <Col>
                    <img
                      src={cita?.idPaciente?.photo?.url || {}}
                      alt="patientimage"
                      id="dr_pt_history"
                    />
                  </Col>
                  <Col>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(cita?.fecha).toLocaleDateString() || "N/A"}
                    </p>
                    <p>
                      <strong>Hora:</strong>{" "}
                      {new Date(cita?.fecha).toLocaleTimeString() || "N/A"}
                    </p>
                    <p>
                      <strong>Motivo:</strong> {cita?.motivo || "N/A"}
                    </p>
                    <p>
                      <strong>Detalles:</strong>{" "}
                      {cita?.detallesAdicionales || "N/A"}
                    </p>
                    <p>
                      <strong>Diagnóstico:</strong>{" "}
                      {cita?.detallesDiagnostico || "N/A"}
                    </p>
                    <p>
                      <strong>Recomendaciones:</strong>{" "}
                      {cita?.recomendaciones || "N/A"}
                    </p>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Alert message="No tienes citas realizadas." type="info" />
      )}
    </div>
  );
};

export default DoctorHistory;
