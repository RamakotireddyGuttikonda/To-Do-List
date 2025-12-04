import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PreviousTasks() {
  const navigate = useNavigate();
  const [PreviousTasks, setPreviousTasks] = useState([]);
  const [Error, setError] = useState("");

  const fetchPreviousTasks = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:3000/previousTasks");
      const data = await res.json();
      setPreviousTasks(data.success ? data.tasks : []);
    } catch {
      setError("Failed to fetch previous tasks");
    }
  };

  useEffect(() => {
    fetchPreviousTasks();
  }, []);

  const completedCount = PreviousTasks.filter(t => t.Status === "Completed").length;
  const pendingCount = PreviousTasks.filter(t => t.Status === "Pending").length;
  const totalCount = PreviousTasks.length;

  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const ProgressCircle = ({ percent }) => {
    const radius = 60;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle stroke="#334155" fill="transparent" strokeWidth={stroke}
          r={normalizedRadius} cx={radius} cy={radius} />

        <circle stroke="#22c55e" fill="transparent" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          r={normalizedRadius} cx={radius} cy={radius} />

        <text x="50%" y="50%" dy=".3em" textAnchor="middle"
          className="text-lg sm:text-xl fill-white font-bold">
          {percent}%
        </text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen bg-blue-200 p-4 lg:p-6">

      <div className="w-full lg:w-80 bg-slate-900 rounded-2xl shadow-2xl flex flex-col justify-between items-center py-10 text-white">

        <div className="text-center">
          <p className="text-3xl font-bold">Progress</p>
          <ProgressCircle percent={progressPercent} />

          <div className="mt-4 space-y-1">
            <p>Total Tasks: {totalCount}</p>
            <p className="text-green-400">Completed: {completedCount}</p>
            <p className="text-yellow-400">Pending: {pendingCount}</p>
          </div>
        </div>

        <button
          className="bg-blue-400 text-red-900 px-4 py-2 rounded-md"
          onClick={() => navigate("/")}
        >
          Back To Current Tasks
        </button>

      </div>

      <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-8 mt-4 lg:mt-0 lg:ml-6">

        <h1 className="text-3xl font-bold mb-1">
          Previous <span className="text-blue-600">Tasks</span>
        </h1>

        <p className="text-slate-600 mb-6">
          Completed tasks from yesterday.
        </p>

        {Error && <p className="text-red-500 text-center mt-3">{Error}</p>}

        <table className="w-full mt-8 bg-white shadow rounded-xl">

          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Task</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {PreviousTasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-slate-400">
                  No tasks from yesterday
                </td>
              </tr>
            ) : (
              PreviousTasks.map((task, index) => (
                <tr key={task._id} className="border-b">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{task.Task}</td>
                  <td className="p-3">{task.Status}</td>
                  <td className="p-3">
                    {new Date(task.Date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PreviousTasks;
