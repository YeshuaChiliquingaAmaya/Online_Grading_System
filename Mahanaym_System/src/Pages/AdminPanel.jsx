import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role_id: 3 });
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchParents();
    fetchStudents();
  }, []);

  // Funciones para obtener usuarios, padres y estudiantes
  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/admin/users");
    const data = await response.json();
    setUsers(data);
  };

  const fetchParents = async () => {
    const response = await fetch("http://localhost:5000/admin/parents");
    const data = await response.json();
    setParents(data);
  };

  const fetchStudents = async () => {
    const response = await fetch("http://localhost:5000/admin/students");
    const data = await response.json();
    setStudents(data);
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = async () => {
    const response = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      alert("Usuario agregado correctamente");
      fetchUsers(); // Recargar los usuarios
    } else {
      alert("Error al agregar usuario");
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id) => {
    const response = await fetch(`http://localhost:5000/admin/users/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Usuario eliminado correctamente");
      fetchUsers(); // Recargar los usuarios
    } else {
      alert("Error al eliminar usuario");
    }
  };

  // Función para asignar estudiantes a un padre
  const handleAssignStudentsToParent = async () => {
    if (!selectedParent || selectedStudents.length === 0) {
      alert("Por favor, seleccione un padre y al menos un estudiante.");
      return;
    }

    const response = await fetch("http://localhost:5000/admin/parents/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parentId: selectedParent,
        studentIds: selectedStudents,
      }),
    });

    if (response.ok) {
      alert("Estudiantes asignados correctamente");
    } else {
      alert("Error al asignar estudiantes");
    }
  };

  return (
    <div>
      <h2>Panel de Administración</h2>

      {/* Tabla de Usuarios */}
      <h3>Usuarios</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role_id}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Agregar Usuario */}
      <h3>Agregar Usuario</h3>
      <input
        type="text"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        placeholder="Nombre"
      />
      <input
        type="email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        placeholder="Correo"
      />
      <input
        type="password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        placeholder="Contraseña"
      />
      <select
        value={newUser.role_id}
        onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
      >
        <option value="1">Administrador</option>
        <option value="2">Profesor</option>
        <option value="3">Estudiante</option>
        <option value="4">Padre</option>
      </select>
      <button onClick={handleAddUser}>Agregar Usuario</button>

      {/* Asignar Estudiantes a Padre */}
      <h3>Asignar Estudiantes a un Padre</h3>

      {/* Selección de Padre */}
      <div className="form-group">
        <label htmlFor="parentSelect">Seleccionar Padre</label>
        <select
          className="form-control"
          id="parentSelect"
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
        >
          <option value="">Seleccione un Padre</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de Estudiantes */}
      <div className="form-group">
        <label htmlFor="studentSelect">Seleccionar Estudiantes</label>
        <select
          className="form-control"
          id="studentSelect"
          multiple
          value={selectedStudents}
          onChange={(e) =>
            setSelectedStudents([...e.target.selectedOptions].map((option) => option.value))
          }
        >
          <option value="">Seleccione estudiantes</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para asignar estudiantes */}
      <button onClick={handleAssignStudentsToParent} className="btn btn-primary">
        Asignar Estudiantes
      </button>

      {/* Mostrar asignaciones de estudiantes a padres */}
      <h3>Asignaciones de Estudiantes a Padres</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Padre</th>
            <th>Estudiante</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {selectedStudents.map((studentId) => {
            // Verificación para evitar el error "find is undefined"
            const student = students.find((s) => s.id === parseInt(studentId));
            const parent = parents.find((p) => p.id === parseInt(selectedParent));

            // Si no se encuentra el padre o el estudiante, mostramos un valor predeterminado
            return (
              <tr key={studentId}>
                <td>{parent ? parent.name : "Desconocido"}</td>
                <td>{student ? student.name : "Desconocido"}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
