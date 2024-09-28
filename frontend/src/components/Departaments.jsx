import { Card } from "antd";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Departaments = () => {
  const departments = [
    {
      name: "Ortopedia",
      imageUrl: "/departments/ortoped.png",
    },
    {
      name: "Cardiologia",
      imageUrl: "/departments/cardio.png",
    },
    {
      name: "Neurologia",
      imageUrl: "/departments/neuro.png",
    },
    {
      name: "Radiologia",
      imageUrl: "/departments/radio.png",
    },
    {
      name: "Terapia Fisica",
      imageUrl: "/departments/terapia.png",
    },
    {
      name: "Dermatologia",
      imageUrl: "/departments/derma.png",
    },
  ];

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="container departments">
      <h2>Servicios</h2>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={[
          // "superLargeDesktop",
          // "desktop",
          "tablet",
          "mobile",
        ]}
      >
        {departments.map((depart, index) => {
          return (
            <Card
              key={index}
              style={{
                width: "80%",
              }}
            >
              <div className="card_dpm">
                <img
                  src={depart.imageUrl}
                  alt="Department"
                  style={{ width: "20%" }}
                />
                <div className="depart-name">{depart.name}</div>
              </div>
            </Card>

            // <div key={index} className="card">
            //   <div className="depart-name">{depart.name}</div>
            //   <img src={depart.imageUrl} alt="Department" />
            // </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Departaments;
