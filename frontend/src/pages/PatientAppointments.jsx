import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Spin, Alert, Button } from "antd";

const PatientAppointments = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Llama a la API para obtener el historial del paciente
        const response = await axios.get(
          "http://localhost:4000/api/patient/appointments",
          {
            withCredentials: true, // Importante para que las cookies se envíen
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Obtener respuesta de la petición
        const data = response.data;

        // Si es un éxito
        if (data.success) {
          // Setear el historial con el data.appointments que es lo que devuelve la respuesta en el backend
          setHistorial(data.appointments);
        } else {
          console.log("No se encontraron citas");
          setHistorial([]);
        }
      } catch (err) {
        setError("Error al obtener citas del paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  //CITAS PENDIENTES Y REALIZADAS
  const citasPendientes = historial.filter(
    (cita) => cita.estado === "PENDIENTE"
  );
  const citasRealizadas = historial.filter(
    (cita) => cita.estado === "REALIZADA"
  );

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Row gutter={16}>
      {/* Sección de Citas Pendientes */}
      <Col span={12}>
        <h2 className="nooverflow">Citas Pendientes</h2>
        {citasPendientes.length > 0 ? (
          citasPendientes.map((cita, index) => (
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
                <strong>Hora:</strong>
              </p>
              <p>
                <strong>Detalles:</strong> {cita.detallesAdicionales}
              </p>

              <div className="nooverflow">
                <Button danger block size="small" type="primary">
                  Cancelar cita
                </Button>
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
        {citasRealizadas.length > 0 ? (
          citasRealizadas.map((cita, index) => (
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
                <strong>Hora:</strong> {cita.hora}
              </p>
              <p>
                <strong>Detalles del Diagnóstico:</strong>{" "}
                {cita.detallesDiagnostico}
              </p>
              <p>
                <strong>Recomendaciones:</strong> {cita.recomendaciones}
              </p>
            </Card>
          ))
        ) : (
          <Alert message="No tienes citas realizadas." type="info" />
        )}
      </Col>
    </Row>
  );
};

export default PatientAppointments;
