import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask("");
  };

  const deleteTask = (indexToDelete) => {
  setTasks(
    tasks.filter((_, i) => i !== indexToDelete)
  );
};

  return (
    <>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}
          <button onClick={() => deleteTask(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
