import express from "express";

const app = express();
app.use(express.json());

let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: 3,
    taskName: "Test Application",
    assignedTo: "Amit Kumar",
    status: "Pending",
    priority: "Low"
  }
];

// GET: Retrieve all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET: Retrieve task by ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// POST: Add a new task
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (
    id === undefined || id === null ||
    !taskName || !assignedTo || !status || !priority
  ) {
    return res.status(400).json({
      message: "id, taskName, assignedTo, status and priority are required"
    });
  }

  if (tasks.some(t => t.id === Number(id))) {
    return res.status(400).json({ message: "Task ID already exists" });
  }

  const task = {
    id: Number(id),
    taskName,
    assignedTo,
    status,
    priority
  };

  tasks.push(task);

  res.status(201).json({
    message: "Task added successfully",
    task
  });
});

// PUT: Update task
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "taskName, assignedTo, status and priority are required"
    });
  }

  task.taskName = taskName;
  task.assignedTo = assignedTo;
  task.status = status;
  task.priority = priority;

  res.status(200).json({
    message: "Task updated successfully",
    task
  });
});

// DELETE: Remove task
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    t => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted successfully"
  });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
  res.status(400).json({ message: "Invalid JSON request" });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});