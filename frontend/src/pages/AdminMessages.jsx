import React, { useEffect, useState } from "react";
import axios from "axios";
import { Popconfirm, Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";

const AdminMessages = () => {
  const [messages, setMessages] = useState("");
  const navigate = useNavigate();
  //   const [selectedMessage, setSelectedMessage] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/messages",
          {
            withCredentials: true,
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    getMessages();
  }, []);

  //Borrar todos los mensajes
  const handleClearAll = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:4000/api/admin/clearmessages",
        { withCredentials: true }
      );
      if (response.data.success) {
        message.success("Los mensajes se han vaciado correctamente");
        navigate("/adminpanel/profile");
        setMessages([]);
      } else {
        message.error("Error al eliminar los mensajes.");
      }
    } catch (error) {
      console.error("Error al eliminar los mensajes:", error);
      message.error("Error al eliminar los mensajes.");
    }
  };

  //Eliminar message por id
  const handleDelete = async (id) => {
    console.log(id);

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/deletemessage/${id}`,
        {
          withCredentials: true, // Para asegurarse de que las cookies se manejen correctamente
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        message.success("Mensaje eliminado correctamente");
        navigate("/adminpanel/profile");
        setMessages((prev) => prev.filter((doctor) => doctor._id !== id));
      }
    } catch (error) {
      message.error("Error al eliminar el Mensaje");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Popconfirm
          title="Are you sure to delete this message?"
          okText="Yes"
          onConfirm={() => handleDelete(record._id)}
          cancelText="No"
        >
          <Button danger>Eliminar</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {messages && messages.length > 0 ? (
        <>
          <Button danger onClick={handleClearAll}>
            Limpiar / Borrar Mensajes
          </Button>
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={messages}
          />
        </>
      ) : (
        <>
          <h3>No se registran mensajes enviados</h3>
        </>
      )}
    </div>
  );
};

export default AdminMessages;
