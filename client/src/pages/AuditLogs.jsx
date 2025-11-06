import { useEffect, useState } from "react";
import { api } from "../api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit").then(r => setLogs(r.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
      <pre className="bg-white p-4 rounded shadow">{JSON.stringify(logs.slice(0,30), null, 2)}</pre>
    </div>
  );
}
