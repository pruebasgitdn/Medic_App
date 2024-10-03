import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { Button, Card, Form, List, message, Input } from "antd";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated, user } = useContext(Context);

  const { TextArea } = Input;

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/appointments",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // Filtra las citas por estado 'PENDIENTE'
          const pendientes = response.data.appointments.filter(
            (appointment) => appointment.estado === "PENDIENTE"
          );
          setAppointments(pendientes); // Reasigna solo las citas pendientes
        } else {
          message.error("No se encontraron citas para el doctor.");
        }
      } catch (error) {
        console.log(error);
        message.error("Error al cargar las citas.");
      }
    };
    fetchAppointment();
  }, []);

  return (
    <div>
      <h2 className="nooverflow">Citas Proximas y Agendadas</h2>
      {appointments && appointments.length > 0 ? (
        <div>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
            dataSource={appointments}
            renderItem={(appointment) => (
              <List.Item key={appointment._id}>
                <Card title={`Paciente: ${appointment.idPaciente.nombre}`}>
                  <p>
                    <strong>Estado:</strong> {appointment.estado}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(appointment.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Hora:</strong>{" "}
                    {new Date(appointment.fecha).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {appointment.motivo}
                  </p>

                  <p>
                    <strong>Detalles Adicionales: </strong>
                    <br />
                    {appointment?.detallesAdicionales}
                  </p>

                  <hr />
                  <div className="">
                    <Form name="responsedr">
                      <Form.Item
                        label="Responder al paciente"
                        name="response"
                        className="form-item"
                        rules={[
                          {
                            max: 150,
                            required: true,
                            message: "Maximo 150 caracteres",
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          placeholder="Dar solucion al paciente ..."
                        />
                      </Form.Item>

                      <div className="btns_responder">
                        <Button
                          block
                          form="responsedr"
                          htmlType="submit"
                          type="primary"
                          className="btn_responder"
                        >
                          Responder
                        </Button>
                        <Button danger type="primary" block>
                          Cancelar Cita
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <div>
          <Card title="No tienes citas agendadas de momento!"></Card>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
