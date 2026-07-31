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
  const successPercentage =
    totalCalls === 0 ? 0 : ((successCount / totalCalls) * 100).toFixed(1);

  const failurePercentage =
    totalCalls === 0 ? 0 : ((failureCount / totalCalls) * 100).toFixed(1);
  const [responseTime, setResponseTime] = useState(0);
  const [responseHistory, setResponseHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(intervalMs / 1000);
  useEffect(() => {
    if (!isRunning) return;

    setCountdown(intervalMs / 1000);

    const id = setInterval(() => {
      setCountdown((c) => (c <= 1 ? intervalMs / 1000 : c - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [intervalMs, isRunning]);
  const fetchApi = useCallback(async () => {
    setTotalCalls((c) => c + 1);

    const start = performance.now();

    try {
      const res = await fetch("http://localhost:8090/api/hello");

      const end = performance.now();
      const ms = Math.round(end - start);

      setResponseTime(ms);
      setResponseHistory((prev) => [...prev.slice(-19), ms]);

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      setMessage(data.message);
      setLastUpdated(data.timestamp);
      setStatus("🟢 Backend Connected");
      setSuccessCount((c) => c + 1);

      setHistory((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          status: "Success",
          responseTime: ms,
        },
        ...prev.slice(0, 19),
      ]);
    } catch {
      setStatus("🔴 Backend Offline");
      setMessage("Backend not running");
      setFailureCount((c) => c + 1);

      setHistory((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          status: "Failed",
          responseTime: "-",
        },
        ...prev.slice(0, 19),
      ]);
    }
  }, []);

  const averageResponse =
    responseHistory.length === 0
      ? 0
      : Math.round(
          responseHistory.reduce((a, b) => a + b, 0) / responseHistory.length,
        );

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isRunning) {
      // Initial API call
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchApi();

      // Start interval
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
          <Card title='⏳ Next Refresh'>{countdown}s</Card>
          <Card title='Total Calls'>{totalCalls}</Card>

          <Card title='Successful Calls'>{successCount}</Card>

          <Card title='Failed Calls'>{failureCount}</Card>

          <Card title='Auto Refresh'>{isRunning ? "Running" : "Stopped"}</Card>
          <Card title='Success %'>
            <span style={{ color: "green" }}>{successPercentage}%</span>
          </Card>

          <Card title='Failure %'>
            <span style={{ color: "red" }}>{failurePercentage}%</span>
          </Card>
          <Card title='⚡ Avg Response'>{averageResponse} ms</Card>
          <Card title='🚀 Fastest'>
            {responseHistory.length ? Math.min(...responseHistory) : 0} ms
          </Card>
          <Card title='🐢 Slowest'>
            {responseHistory.length ? Math.max(...responseHistory) : 0} ms
          </Card>
          <Card title='Backend Status'>
            <span
              style={{
                color: status.includes("Connected") ? "#16a34a" : "#dc2626",
                fontWeight: "bold",
              }}
            >
              {status}
            </span>
          </Card>
        </div>

        <div style={{ marginTop: 10 }}>
          Success: {successPercentage}% | Failure: {failurePercentage}%
        </div>

        <div
          style={{
            height: 28,
            borderRadius: 30,
            background: "#ddd",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${successPercentage}%`,
              height: "100%",
              background: "linear-gradient(90deg,#00c853,#64dd17)",
              transition: ".5s",
            }}
          />
        </div>
        <table
          style={{
            width: "100%",
            marginTop: 30,
            borderCollapse: "collapse",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              background: "#1e293b",
              color: "#fff",
            }}
          >
            <tr>
              <th style={{ padding: 12 }}>Time</th>
              <th>Status</th>
              <th>Response</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 ? "#f8fafc" : "#fff",
                }}
              >
                <td style={{ padding: 12 }}>{item.time}</td>

                <td>
                  <span
                    style={{
                      color: item.status === "Success" ? "#16a34a" : "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    {item.status}
                  </span>
                </td>

                <td>{item.responseTime} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
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
