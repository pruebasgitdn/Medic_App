import { useEffect, useState } from "react";
import { Card, List, Spin, Alert, Select, Row, Col, Avatar } from "antd";
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
        const response = await axios.get(
          "http://localhost:4000/api/patient/gethistory",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        if (data.success) {
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
  console.log(historial);

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
            <Option value="recent">Antiguos</Option>
            <Option value="oldest">Recientes</Option>
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
                <Card title={`Reporte ${index + 1}`} className="card_appont">
                  <Row gutter={[0]}>
                    <div id="il">
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <p>
                          <strong>Doctor:</strong>{" "}
                          {`${reporte.idDoctor.nombre} ${reporte.idDoctor.apellido_pat}`}
                        </p>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Avatar size={35} src={reporte?.idDoctor?.photo?.url} />
                      </Col>
                    </div>
                  </Row>

                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(reporte.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {reporte.motivo}
                  </p>

                  <p>
                    <strong>Diagnóstico:</strong> {reporte.detallesDiagnostico}
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
