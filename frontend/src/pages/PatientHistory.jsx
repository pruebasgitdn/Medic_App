import React, { useEffect, useState } from "react";
import { Card, List, Spin, Alert } from "antd";
import axios from "axios";

const PatientHistory = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Obtener respuesta de la petición
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
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
          <List
            grid={{ gutter: 16, column: 1 }} // Layout en una columna
            dataSource={historial}
            renderItem={(reporte, index) => (
              <List.Item>
                <Card
                  title={`Reporte ${index + 1}`}
                  bordered={false}
                  className="card_adv"
                >
                  <p>
                    <strong>Motivo:</strong> {reporte.motivo}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {`${reporte.idDoctor.nombre} ${reporte.idDoctor.apellido_pat}`}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(reporte.fecha).toLocaleDateString()}
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
