import { useEffect, useState } from "react";
import { api } from "../api";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    api.get("/audit").then(r => setLogs(r.data));
  }, []);

  const counts = logs.reduce((c, l) => ((c[l.action] = (c[l.action] || 0) + 1), c), {});

  function analyze() {
    api.get("/analyze").then(r => setAiResult(r.data.analysis));
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-screen">

      <h1 className="text-3xl font-bold mb-5">Analytics Overview</h1>

      <div className=" w-1/2 h-2/3 glass soft-shadow p-6 rounded-xl">
      <Bar
  key={JSON.stringify(counts)}
  data={{
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Action Count",
        data: Object.values(counts),
        backgroundColor: "#2563eb"
      }
    ]
  }}
/>


      </div>

      <button
        onClick={analyze}
        className="bg-green-300 hover:border-amber-100 text-black mt-8 px-5 py-2 rounded-lg transition"
      >
        🔍 Analyze Logs with AI
      </button>

      {aiResult && (
        <div className="glass soft-shadow p-6 rounded-xl border-l-4 border-yellow-400 max-w-3xl">
          <h2 className="font-semibold text-lg mb-2">AI Security Report</h2>
          <p className="whitespace-pre-line">{aiResult}</p>
        </div>
      )}
    </div>
  );
}
