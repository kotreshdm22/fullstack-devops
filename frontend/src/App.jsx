import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Waiting...");
  const [intervalMs, setIntervalMs] = useState(5000);
  const [isRunning, setIsRunning] = useState(true);

  const [totalCalls, setTotalCalls] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("-");

  const timerRef = useRef(null);

  const fetchApi = useCallback(() => {
    setTotalCalls((c) => c + 1);

    fetch("http://localhost:8090/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setMessage(`${data.message}`);
        setLastUpdated(data.timestamp);
        setSuccessCount((c) => c + 1);
        setStatus("🟢 Backend Connected");
      })
      .catch(() => {
        setMessage("Backend not running");
        setFailureCount((c) => c + 1);
        setStatus("🔴 Backend Offline");
      });
  }, []);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isRunning) {
      timerRef.current = setInterval(fetchApi, intervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchApi, intervalMs, isRunning]);

  return (
    <div
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>🚀 Spring Boot + React Dashboard</h1>

        <h3>{status}</h3>

        <hr />

        <h2>{message}</h2>

        <p>
          <strong>Last Updated:</strong> {lastUpdated}
        </p>

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <button onClick={fetchApi}>🔄 Call API Now</button>

          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "⏸ Stop Auto Refresh" : "▶ Start Auto Refresh"}
          </button>

          <button
            onClick={() => setIntervalMs((i) => Math.max(1000, i - 1000))}
          >
            ➖ Faster
          </button>

          <button onClick={() => setIntervalMs((i) => i + 1000)}>
            ➕ Slower
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 15,
          }}
        >
          <Card title='Interval'>{(intervalMs / 1000).toFixed(0)} sec</Card>

          <Card title='Total Calls'>{totalCalls}</Card>

          <Card title='Successful Calls'>{successCount}</Card>

          <Card title='Failed Calls'>{failureCount}</Card>

          <Card title='Auto Refresh'>{isRunning ? "Running" : "Stopped"}</Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: "#eef4ff",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default App;
