import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CurrentTasks() {
  const navigate = useNavigate();
  const [Task, setTask] = useState("");
  const [Message, setMessage] = useState("");
  const [Error, setError] = useState("");
  const [PresentTasks, setPresentTasks] = useState([]);

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
          textAnchor="middle"
          dy=".3em"
          className="text-lg sm:text-xl fill-white font-bold"
        >
          {percent}%
        </text>
      </svg>
    );
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/getTasks");
      const data = await res.json();

      setPresentTasks(data.success ? data.tasks : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Task.trim()) return;

    try {
      setMessage("");

      const res = await fetch("http://localhost:3000/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Task })
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Task Added Successfully");
        setTask("");
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markCompleted = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/updateTaskStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen bg-blue-200 p-4 lg:p-6">

      {/* Sidebar */}
      <div className="w-full lg:w-80 h-auto lg:h-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col justify-between items-center py-8 lg:py-12 text-center text-white">

        <div className="space-y-3 lg:space-y-4 py-6 lg:py-10">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Progress
          </p>

          <ProgressCircle percent={progressPercent} />

          <div className="space-y-1 text-base lg:text-lg mt-3 lg:mt-4">
            <p>Total Tasks: {totalCount}</p>
            <p className="text-green-400">Completed: {completedCount}</p>
            <p className="text-yellow-400">Pending: {pendingCount}</p>
          </div>
        </div>

        <button
          className="text-base lg:text-xl bg-blue-400 text-red-900 px-4 py-2 lg:p-3 rounded-md"
          onClick={() => navigate("/previousTasks")}
        >
          Explore Previous Tasks
        </button>

      </div>


      {/* Main */}
      <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-5 lg:p-10 mt-4 lg:mt-0 lg:ml-6">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          To-Do List <span className="text-blue-600">Amendment</span>
        </h1>

        <p className="text-slate-600 mb-6 lg:mb-10">
          Stay organized, one task at a time.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
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

        <div className="mt-10 overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl min-w-[500px]">

            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {PresentTasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-400">
                    No tasks found
                  </td>
                </tr>
              ) : (
                PresentTasks.map((task, index) => (
                  <tr key={task._id} className="border-b hover:bg-blue-50">
                    <td className="p-3 text-slate-600">{index + 1}</td>
                    <td className="p-3">{task.Task}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          task.Status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.Status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => markCompleted(task._id)}
                        disabled={task.Status === "Completed"}
                        className={`px-4 py-2 rounded-lg ${
                          task.Status === "Completed"
                            ? "bg-gray-400"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {task.Status === "Completed" ? "Done" : "Mark Complete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default CurrentTasks;
