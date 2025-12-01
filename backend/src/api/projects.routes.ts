import { Router } from "express";
import { pool } from "../db";
import { validateBody,  projectSchema } from "../validation";

const projectsRouter = Router();

// GET all
projectsRouter.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        proj.id,
        proj.name,
        proj.description,
        proj.created_at,
        COUNT(task.id) AS total_tasks
      FROM projects proj
      LEFT JOIN tasks task ON task.project_id = proj.id
      GROUP BY proj.id
      ORDER BY proj.id
    `);

    // Nano-adapter
    const converted = result.rows.map(({created_at, total_tasks, ...proj}) => ({
      ...proj,
      createdAt: created_at,
      totalTasks: Number(total_tasks)
    }))

    res.status(200).json(converted);
    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET by ID
projectsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: "Invalid project ID" });

  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST (create project)
projectsRouter.post("/", validateBody(projectSchema), async (req, res) => {
     const { name, description = null } = req.body;

     try {
        const result = await pool.query(
      "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
        return res.status(201).json(result.rows[0]);

     } catch (error) {
        console.error("Error creating a project:", error);
        return res.status(500).json({ error: "Internal server error" });
     }
})

// PUT (update project)
projectsRouter.put("/:id", validateBody(projectSchema.partial()), async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  const { name, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description ?? null, id]
    );

    return res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
projectsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    await pool.query("DELETE FROM tasks WHERE project_id = $1", [id]); 
    await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );

    return res.status(200).json({ message: "Project deleted" });

  } catch (err) {
    console.error("Error deleting project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default projectsRouter;