const Hero = ({ title, imageURL }) => {
  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p
          style={{
            fontStyle: "small",
          }}
        >
          Mede Link-CARE te ofrece los mejores servicios al servicio de los
          mejores especialistas en las diferentes ramas de la salud. Nuestro
          equipo de profesionales esta comprometido a brindarle el mejor
          servicio y atencion personalizada a cada paciente. En Link-CARE
          nuestra prioridad son los pacientes.
        </p>
      </div>
      <div className="banner">
        <img src={imageURL} alt="" />
      </div>
    </div>
  );
};

export default Hero;
