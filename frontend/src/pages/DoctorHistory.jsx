import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Alert, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const DoctorHistory = () => {
  const [data, setData] = useState([""]);

  const items = [
    {
      key: "1",
      label: <a>Recientes</a>,
    },
    {
      key: "2",
      label: <a>Antiguos</a>,
    },
  ];

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
  console.log(citasRealizadas);

  return (
    <div>
      <h2>Historial de Citas Realizadas</h2>
      <Dropdown
        menu={{
          items,
        }}
      >
        <Button>
          Ordenar <DownOutlined />
        </Button>
      </Dropdown>
      {citasRealizadas.length > 0 ? (
        citasRealizadas.map((cita, index) => (
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
