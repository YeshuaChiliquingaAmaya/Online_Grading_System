import React, { useState } from "react";

const Home = ({ setUser }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setSuccess(""); // Limpiar mensajes previos

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Almacenar los datos del usuario en el estado
        setUser({ id: data.userId, name: data.name, role: data.role });
        setSuccess(`¡Bienvenido, ${data.name}!`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error en la conexión con el servidor.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Inicio de Sesión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", marginBottom: "20px", width: "300px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          Iniciar Sesión
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
};

export default Home;
