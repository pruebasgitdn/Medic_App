import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Alert, Dropdown, Button, Select } from "antd";

const { Option } = Select;

const DoctorHistory = () => {
  const [order, setOrder] = useState("recent");
  const [data, setData] = useState([""]);

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
      console.log(data);
    };

    fetchAppointments();
  }, []);

  // Filtramos las citas que están en estado 'REALIZADA'
  const citasRealizadas = data.filter((cita) => cita.estado === "REALIZADA");

  const ordenarCitas = (a, b) => {
    if (order === "recent") {
      return new Date(a.fecha) - new Date(b.fecha); // De más reciente a más antiguo
    } else {
      return new Date(b.fecha) - new Date(a.fecha); // De más antiguo a más reciente
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
        style={{ width: 200, marginBottom: "16px" }}
      >
        <Option value="recent">Recientes</Option>
        <Option value="oldest">Antiguas</Option>
      </Select>
      {citasOrdenadas.length > 0 ? (
        citasOrdenadas.map((cita, index) => (
          <Card
            key={index}
            title={`Paciente: ${cita.idPaciente.nombre} ${cita.idPaciente.apellido_pat} `}
          >
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(cita.fecha).toLocaleDateString()}
            </p>
            <p>
              <strong>Hora:</strong> {new Date(cita.fecha).toLocaleTimeString()}
            </p>
            <p>
              <strong>Motivo:</strong> {cita.motivo}
            </p>
            <p>
              <strong>Detalles:</strong> {cita.detallesAdicionales}
            </p>
            <p>
              <strong>Diagnóstico:</strong> {cita.detallesDiagnostico}
            </p>
            <p>
              <strong>Recomendaciones:</strong> {cita.recomendaciones}
            </p>
          </Card>
        ))
      ) : (
        <Alert message="No tienes citas realizadas." type="info" />
      )}
    </div>
  );
};

export default DoctorHistory;
