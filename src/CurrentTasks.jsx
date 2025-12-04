import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CurrentTasks() {
  const navigate = useNavigate();

  const [Task, setTask] = useState("");
  const [Message, setMessage] = useState("");
  const [Error, setError] = useState("");
  const [PresentTasks, setPresentTasks] = useState([]);

  // ------------------ HELPERS ------------------
  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage("");
    } else {
      setMessage(msg);
      setError("");
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  // ------------------ PROGRESS ------------------
  const completedCount = PresentTasks.filter(t => t.Status === "Completed").length;
  const pendingCount = PresentTasks.filter(t => t.Status === "Pending").length;
  const totalCount = PresentTasks.length;

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
        <circle
          stroke="#334155"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "0.4s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          className="text-lg sm:text-xl fill-white font-bold"
        >
          {percent}%
        </text>
      </svg>
    );
  };

  // ------------------ API ------------------

  const fetchTasks = async () => {
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3000/getTasks");
      const data = await res.json();

      setPresentTasks(data.success ? data.tasks : []);
    } catch {
      showMessage("Failed to fetch tasks", true);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Task.trim()) return;

    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3000/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Task })
      });

      const data = await res.json();

      if (data.success) {
        setTask("");
        fetchTasks();
        showMessage("Task added successfully");
      } else {
        showMessage("Failed to add task", true);
      }
    } catch {
      showMessage("Failed to add task", true);
    }
  };

  const markCompleted = async (id) => {
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3000/updateTaskStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.success) {
        fetchTasks();
        showMessage("Task marked completed");
      } else {
        showMessage("Failed to update task", true);
      }
    } catch {
      showMessage("Failed to update task", true);
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen bg-blue-200 p-4 lg:p-6">

      {/* Sidebar */}
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
          onClick={() => navigate("/previousTasks")}
        >
          Explore Previous Tasks
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-8 mt-4 lg:mt-0 lg:ml-6">

        <h1 className="text-3xl font-bold mb-1">
          To-Do List <span className="text-blue-600">Amendment</span>
        </h1>
        <p className="text-slate-600 mb-6">Stay organized, one task at a time.</p>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            className="flex-1 px-4 py-3 border rounded-xl"
            value={Task}
            onChange={e => setTask(e.target.value)}
            placeholder="What needs to be done?"
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Add Task
          </button>
        </form>

        {Message && <p className="text-green-600 text-center mt-3">{Message}</p>}
        {Error && <p className="text-red-500 text-center mt-3">{Error}</p>}

        <table className="w-full mt-8 bg-white shadow rounded-xl">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Task</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>

          <tbody>
            {PresentTasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-slate-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              PresentTasks.map((task, index) => (
                <tr key={task._id} className="border-b">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{task.Task}</td>
                  <td className="p-3">{task.Status}</td>
                  <td className="p-3">
                    <button
                      disabled={task.Status === "Completed"}
                      onClick={() => markCompleted(task._id)}
                      className={`px-4 py-2 rounded-lg ${
                        task.Status === "Completed"
                          ? "bg-gray-400"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {task.Status === "Completed"
                        ? "Done"
                        : "Mark Complete"}
                    </button>
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

export default CurrentTasks;
