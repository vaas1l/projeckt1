import React, { useEffect, useState } from "react";

const App = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/services")  // Підключення до бекенду
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Помилка:", error));
  }, []);

  return (
    <div>
      <h1>POS System</h1>
      <h2>Послуги</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>{service.name} - {service.price} Kč</li>
        ))}
      </ul>
    </div>
  );
};

export default App;