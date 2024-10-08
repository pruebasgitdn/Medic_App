import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button } from "antd";
import axios from "axios";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/getPatients",
          {
            withCredentials: true,
          }
        );
        setPatients(response.data.patients);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, []);

  // Configuración de las columnas para la tabla
  const columns = [
    {
      title: "Foto",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img src={photo.url} alt="Doctor" className="admindoctorsimg" />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Apellido",
      dataIndex: "apellido_pat",
      key: "apellido_pat",
    },
    {
      title: "Tipo ID",
      dataIndex: "identificacion_tipo",
      key: "identificacion_tipo",
    },
    {
      title: "#ID",
      dataIndex: "identificacion_numero",
      key: "identificacion_numero",
    },

    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Acciones",
      key: "acciones",
      render: (record) => (
        <div className="adminperfil_btns">
          <Button type="link">
            <Link to={`/adminpanel/editdoctor/${record._id}`}>Editar</Link>
          </Button>
          <Button danger>
            <Link to={`/adminpanel/editdoctor/${record._id}`}>Eliminar</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="nooverflow">Administrar Pacientes </h4>
      {/* <Link to="/adminpanel/formdoctor">
        <Button type="primary">Agregar doctor</Button>
      </Link> */}

      {/* Tabla de doctores */}
      <Table
        columns={columns}
        dataSource={patients.map((patient) => ({
          ...patient,
          key: patient._id,
        }))}
        pagination={{ pageSize: 5 }} // Controlar el número de filas por página
      />
    </div>
  );
};

export default AdminPatients;
