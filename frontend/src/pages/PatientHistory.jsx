import React, { useEffect, useState } from "react";
import { Card, List, Spin, Alert, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const PatientHistory = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState("recent");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Llama a la API para obtener el historial del paciente
        const response = await axios.get(
          "http://localhost:4000/api/patient/gethistory",
          {
            withCredentials: true, // Importante para que las cookies se envíen
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        //respuesta de la petición
        const data = response.data;

        // Si es un éxito
        if (data.success) {
          // Entonces setear el historial con el data.historial
          setHistorial(data.historial);
        } else {
          console.log("No se encontró historial");
          setHistorial([]);
        }
      } catch (err) {
        setError("Error al obtener el historial del paciente");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const sortedHistorial = () => {
    return historial.sort((a, b) =>
      orden === "recent"
        ? new Date(b.fecha) - new Date(a.fecha)
        : new Date(a.fecha) - new Date(b.fecha)
    );
  };

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) return <Spin tip="Cargando historial médico..." />;

  // Mostrar mensaje de error en caso de fallo
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      {/* Si hay historial, mostrar la lista, de lo contrario un mensaje */}
      {historial.length > 0 ? (
        <div>
          <h2 className="nooverflow">Historial Médico</h2>

          <Select
            defaultValue={orden}
            style={{ width: 200, marginBottom: "16px" }}
            onChange={(value) => setOrden(value)}
          >
            <Option value="recent">Recientes</Option>
            <Option value="oldest">Antiguos</Option>
          </Select>

          <List
            dataSource={sortedHistorial()}
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
            renderItem={(reporte, index) => (
              <List.Item>
                <Card title={`Reporte ${index + 1}`} className="card_adv">
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {`${reporte.idDoctor.nombre} ${reporte.idDoctor.apellido_pat}`}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(reporte.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {reporte.motivo}
                  </p>

                  <p>
                    <strong>Detalles del Diagnóstico:</strong>{" "}
                    {reporte.detallesDiagnostico}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <Alert message="No tienes historial médico." type="info" />
      )}
    </div>
  );
};

export default PatientHistory;
