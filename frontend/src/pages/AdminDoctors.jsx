import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button } from "antd";
import axios from "axios";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/getDoctors",
          {
            withCredentials: true,
          }
        );
        setDoctors(response.data.doctors);
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
      title: "Especialidad",
      dataIndex: "especialidad",
      key: "especialidad",
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
      title: "Número de Licencia",
      dataIndex: "numero_licencia",
      key: "numero_licencia",
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
      <h4 className="nooverflow">Administrar doctores </h4>
      <Link to="/adminpanel/formdoctor">
        <Button type="primary">Agregar doctor</Button>
      </Link>

      {/* Tabla de doctores */}
      <Table
        columns={columns}
        dataSource={doctors.map((doctor) => ({ ...doctor, key: doctor._id }))}
        pagination={{ pageSize: 5 }} // Controlar el número de filas por página
      />
    </div>
  );
};

export default AdminDoctors;
