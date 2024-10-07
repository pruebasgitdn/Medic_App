import React, { useEffect, useState } from "react";
import { Card, message, List, Row, Col, Button, Modal } from "antd";
import axios from "axios";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Estado para el nuevo modal
  const [selectedPatient, setSelectedPatient] = useState(null); // Estado para el paciente seleccionado

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/getpatients",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setPatients(response.data.pacientes);
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

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const showReportModal = (patient) => {
    setSelectedPatient(patient);
    setIsReportModalOpen(true); // Abre el modal de historial
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsReportModalOpen(false); // Cierra ambos modales
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsReportModalOpen(false); // Cierra ambos modales
  };

  return (
    <div>
      <h2 className="nooverflow">Pacientes e Historial</h2>
      {patients.length > 0 ? (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 10,
          }}
          dataSource={patients}
          renderItem={(patient) => (
            <List.Item key={patient._id}>
              <Card
                title={`Paciente: ${patient.nombre} ${patient.apellido_pat}`}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div className="doctorpatient_img">
                      <img src={patient.photo.url} alt="patient" />
                    </div>
                  </Col>
                  <Col xs={24} sm={16}>
                    <div className="aside">
                      <p>
                        <strong>Email: </strong>
                        {patient?.email}
                        <br />
                        <strong>Direccion: </strong>
                        {patient?.direccion}
                        <br />
                        <strong>Telefono: </strong>
                        {patient?.telefono}
                        <br />
                        <strong>Proveedor de seguros: </strong>
                        {patient?.proovedor_seguros}
                        <br />
                      </p>
                      <hr />
                      <p>
                        <strong>Contacto de emergencia: </strong>
                        {patient?.nombre_contacto_emergencia}
                        <br />
                        <strong>Numero: </strong>
                        {patient?.numero_contacto_emergencia}
                        <br />
                        <br />
                        <div className="btns_flex">
                          <Button
                            block
                            id="success_btn"
                            onClick={() => showReportModal(patient)}
                            // Seteamos el estado del paciente para el moda
                          >
                            Reporte Historial
                          </Button>
                          <Button
                            block
                            id="info_btn"
                            onClick={() => showModal(patient)} // Seteamos el estado del paciente para el modal
                          >
                            Alergias
                          </Button>
                        </div>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card title="No has atendido ningun paciente de momento!" />
      )}

      {/* Modal alergias */}
      <Modal
        title="Alergias del paciente"
        open={isModalOpen}
        onOk={handleOk}
        cancelText="Salir"
        onCancel={handleCancel}
      >
        {selectedPatient &&
        selectedPatient.alergias &&
        selectedPatient.alergias.length > 0 ? (
          <ul>
            {selectedPatient.alergias.map((alergiaObj) => (
              <li key={alergiaObj._id}> - {alergiaObj}</li>
            ))}
          </ul>
        ) : (
          <p>No hay alergias registradas.</p>
        )}
      </Modal>

      {/* Modal  historial */}
      <Modal
        title="Historial del paciente"
        open={isReportModalOpen}
        onOk={handleOk}
        cancelText="Salir"
        onCancel={handleCancel}
      >
        {selectedPatient &&
        selectedPatient.reporte_historial &&
        selectedPatient.reporte_historial.length > 0 ? (
          <ul>
            {selectedPatient.reporte_historial.map((reporte, index) => (
              <Card key={index}>
                <strong>Motivo: </strong> {reporte.motivo}
                <br />
                <strong>Fecha: </strong>
                {new Date(reporte.fecha).toDateString()}
                <br />
                <strong>Diagnostico del doctor: </strong>
                {reporte.detallesDiagnostico}
                <hr />
              </Card>
            ))}
          </ul>
        ) : (
          <p>No hay reportes en el historial.</p>
        )}
      </Modal>
    </div>
  );
};

export default DoctorPatients;
