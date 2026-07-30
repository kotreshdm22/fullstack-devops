import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      fetch("http://localhost:8090/api/hello")
        .then((res) => res.text())
        .then((data) => setMessage(`${data} ${new Date().toLocaleString()}`))
        .catch(() => setMessage("Backend not running"));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h4>Spring Boot + React</h4>

      <h6>{message}</h6>
    </div>
  );
}

export default App;
