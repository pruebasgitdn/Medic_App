import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  List,
  message,
  Row,
  Col,
  Form,
  Input,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";

const AdminSupport = () => {
  const [doctorSupports, setDoctorSupports] = useState([]);
  const [patientSupports, setPatientSupports] = useState([]);
  const [respuestaAdmin, setRespuestaAdmin] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const doctorResponse = await axios.get(
          "http://localhost:4000/api/admin/drsupports",
          { withCredentials: true }
        );

        if (doctorResponse.data.success) {
          const pendientes = doctorResponse.data.supports.filter(
            (appointment) => appointment.estado === "PENDIENTE"
          );
          setDoctorSupports(pendientes);
        } else {
          message.error("No se encontraron soportes para doctores.");
        }

        const patientResponse = await axios.get(
          "http://localhost:4000/api/admin/patsupports",
          { withCredentials: true }
        );

        if (patientResponse.data.success) {
          const pendientes = patientResponse.data.supports.filter(
            (appointment) => appointment.estado === "PENDIENTE"
          );

          setPatientSupports(pendientes);
        } else {
          message.error("No se encontraron soportes para pacientes.");
        }
      } catch (error) {
        console.error(error);
        message.error("Error al cargar los soportes.");
      }
    };

    fetchSupports();
  }, []);

  const handleSubmitResponse = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/api/admin/respondsupport/${id}`,
        {
          respuestaAdmin,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setLoading(false);
        message.success("Ticket resuelto exitosamente!!");
        navigate("/adminpanel/profile");
      } else {
        message.error("Error");
      }
    } catch (error) {
      console.log(error);
      message.error("Error al responder ticket");
    }
    console.log(id);
  };

  const handleDeleteTicket = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/deletesupport/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Soporte eliminado correctamente.");
        navigate("/adminpanel/profile");
      }
    } catch (error) {
      console.error("Error al eliminar el soporte:", error);
      message.error("No se pudo eliminar el soporte.");
    }
  };

  return (
    <div>
      <h2 className="nooverflow" id="txt_center">
        Soportes para Pacientes y Doctores del Sistema
      </h2>
      <Row gutter={16}>
        <Col span={12}>
          {doctorSupports.length === 0 ? (
            <p className="nooverflow">No se encontraron registros para soportes de doctores.</p>
          ) : (
            <>
              <h3 className="nooverflow" id="txt_center">
                Doctores
              </h3>
              <List
                dataSource={doctorSupports}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      title={`Soporte ID: ${item._id}`}
                      className="card_admsop"
                    >
                      <p>
                        <b>Nombre: </b>
                        {item.usuario.nombre}
                      </p>
                      <p>
                        <b>Email: </b>
                        {item.usuario.email}
                      </p>
                      <p>
                        <b>Asunto: </b> {item.asunto}
                      </p>
                      <p>
                        <b>Descripcion:</b>
                        <br />
                        {item.description}
                      </p>

                      <p>
                        <b>Estado: </b>
                        {item.estado}
                      </p>

                      <Form>
                        <Form.Item
                          label="Respuesta:"
                          name="respuestaAdmin"
                          className="form-item"
                          rules={[
                            {
                              required: true,
                              message: "Requerido",
                            },
                            {
                              min: 8,
                              message: "Minimo 8 caracteres",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Escribe tu respuesta aquí"
                            onChange={(e) => setRespuestaAdmin(e.target.value)}
                          />
                        </Form.Item>
                        <div className="btns_flex">
                          <Button
                            block
                            type="primary"
                            onClick={() => handleSubmitResponse(item._id)}
                            loading={loading}
                          >
                            Enviar Respuesta
                          </Button>
                          <Popconfirm
                            title="¿Estás seguro de que deseas eliminar este ticket?"
                            onConfirm={() => handleDeleteTicket(item._id)}
                            okText="Sí"
                            cancelText="No"
                          >
                            <Button block danger>
                              Eliminar Ticket
                            </Button>
                          </Popconfirm>
                        </div>
                      </Form>
                    </Card>
                  </List.Item>
                )}
              />
            </>
          )}
        </Col>
        <Col span={12}>
          {patientSupports.length === 0 ? (
            <p className="nooverflow">No se encontraron registros para soportes de pacientes.</p>
          ) : (
            <>
              <h3 className="nooverflow" id="txt_center">
                Pacientes
              </h3>
              <List
                dataSource={patientSupports}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      title={`Soporte ID: ${item._id}`}
                      className="card_admsop"
                    >
                      <p>
                        <b>Nombre: </b>
                        {item.usuario.nombre}
                      </p>
                      <p>
                        <b>Email: </b>
                        {item.usuario.email}
                      </p>
                      <p>
                        <b>Asunto: </b> {item.asunto}
                      </p>
                      <p>
                        <b>Descripcion:</b>
                        <br />
                        {item.description}
                      </p>

                      <p>
                        <b>Estado: </b>
                        {item.estado}
                      </p>

                      <Form>
                        <Form.Item
                          label="Respuesta:"
                          name="respuestaAdmin"
                          className="form-item"
                          rules={[
                            {
                              required: true,
                              message: "Requerido",
                            },
                            {
                              min: 8,
                              message: "Minimo 8 caracteres",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Escribe tu respuesta aquí"
                            onChange={(e) => setRespuestaAdmin(e.target.value)}
                          />
                        </Form.Item>

                        <div className="btns_flex">
                          <Button
                            block
                            type="primary"
                            loading={loading}
                            onClick={() => handleSubmitResponse(item._id)}
                          >
                            Enviar Respuesta
                          </Button>
                          <Popconfirm
                            title="¿Estás seguro de que deseas eliminar este ticket?"
                            onConfirm={() => handleDeleteTicket(item._id)}
                            okText="Sí"
                            cancelText="No"
                          >
                            <Button block danger>
                              Eliminar Ticket
                            </Button>
                          </Popconfirm>
                        </div>
                      </Form>
                    </Card>
                  </List.Item>
                )}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminSupport;
