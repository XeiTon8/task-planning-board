import { Router } from "express";
import { pool } from "../db";
import { taskSchema, validateBody } from "../validation";

const tasksRouter = Router();

// GET all tasks for a project
tasksRouter.get("/:projectId/tasks", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { status, priority, search } = req.query;

  if (isNaN(projectId)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE project_id = $1
        AND ($2::task_status IS NULL OR status = $2::task_status)
        AND ($3::task_priority IS NULL OR priority = $3::task_priority)
       ORDER BY id ASC`,
      [projectId, status || null, priority || null]
    );

    return res.status(200).json(result.rows);

  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET single task
tasksRouter.get("/:projectId/tasks/:taskId", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const taskId = Number(req.params.taskId);

  if (isNaN(projectId) || isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND project_id = $2",
      [taskId, projectId]
    );

    return res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Error fetching task:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE task
tasksRouter.post("/:projectId/tasks", validateBody(taskSchema), async (req, res) => {
  const projectId = Number(req.params.projectId);

  if (isNaN(projectId)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  const { title, description = null, status, priority, dueDate = null } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [projectId, title, description, status, priority, dueDate]
    );

    return res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE task
tasksRouter.put("/:projectId/tasks/:taskId", validateBody(taskSchema.partial()), async (req, res) => {
  const projectId = Number(req.params.projectId);
  const taskId = Number(req.params.taskId);

  if (isNaN(projectId) || isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const { title, description = null, status, priority, dueDate = null } = req.body;

  try {
    const result = await pool.query(
     `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           updated_at = NOW()
       WHERE id = $6 AND project_id = $7
       RETURNING *`,
      [title, description, status, priority, dueDate, taskId, projectId]
    );

    return res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE task
tasksRouter.delete("/:projectId/tasks/:taskId", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const taskId = Number(req.params.taskId);

  if (isNaN(projectId) || isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND project_id = $2 RETURNING *",
      [taskId, projectId]
    );

    return res.status(200).json({ message: "Task deleted" });

  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default tasksRouter;