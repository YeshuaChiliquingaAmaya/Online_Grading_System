import React from "react";

const Home = ({ user }) => {
  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <p>
        {user.role === "Administrator" && "Accede al panel para gestionar usuarios y el sistema."}
        {user.role === "Teacher" && "Gestiona tus clases y calificaciones aquí."}
        {user.role === "Student" && "Consulta tus calificaciones en esta plataforma."}
        {user.role === "Parent" && "Revisa las calificaciones de tus hijos."}
      </p>
    </div>
  );
};

export default Home;
