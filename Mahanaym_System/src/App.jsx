import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Professor from "./Professor";

const App = () => {

  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "70px" }}> {/* Evitar que el navbar cubra el contenido */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profesor" element={<Professor />} />
        </Routes>
      </div>
    </Router>
  );

  
};

export default App;
