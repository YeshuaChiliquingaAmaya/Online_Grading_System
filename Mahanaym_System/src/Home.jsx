import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a la Plataforma Educativa</h1>
      <p>
        Una herramienta diseñada para facilitar la gestión de calificaciones,
        profesores, estudiantes y padres.
      </p>
      <div className="home-sections">
        <div className="section">
          <h2>Profesores</h2>
          <p>
            Gestión de asignaturas, seguimiento de clases y recursos para los
            docentes.
          </p>
        </div>
        <div className="section">
          <h2>Estudiantes</h2>
          <p>
            Consulta de calificaciones, seguimiento de rendimiento y recursos
            educativos.
          </p>
        </div>
        <div className="section">
          <h2>Reportes</h2>
          <p>
            Generación de reportes personalizados para la toma de decisiones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
