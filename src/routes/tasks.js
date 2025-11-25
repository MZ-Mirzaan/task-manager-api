const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const Joi = require("joi");

// Validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").default("pending"),
  dueDate: Joi.date().optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  dueDate: Joi.date().optional()
}).min(1); // must have at least 1 field to update

// Apply auth middleware to ALL routes here
router.use(auth);

/* -------------------------------------------
   CREATE TASK
--------------------------------------------- */
router.post("/", async (req, res, next) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status, dueDate } = value;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, description || "", status, dueDate || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/* -------------------------------------------
   GET ALL TASKS (Pagination + Filter)
--------------------------------------------- */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const status = req.query.status;
    const offset = (page - 1) * limit;

    let filter = "WHERE user_id = $1";
    let params = [userId];

    if (status) {
      filter += " AND status = $2";
      params.push(status);
    }

    const countResult = await pool.query(`SELECT COUNT(*) FROM tasks ${filter}`, params);
    const total = parseInt(countResult.rows[0].count);

    const taskResult = await pool.query(
      `SELECT * FROM tasks ${filter}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      page,
      limit,
      total,
      tasks: taskResult.rows
    });

  } catch (err) {
    next(err);
  }
});

/* -------------------------------------------
   GET ONE TASK
--------------------------------------------- */
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/* -------------------------------------------
   UPDATE TASK
--------------------------------------------- */
router.put("/:id", async (req, res, next) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const userId = req.user.id;
    const taskId = req.params.id;

    const existing = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = existing.rows[0];

    const updated = {
      title: value.title ?? task.title,
      description: value.description ?? task.description,
      status: value.status ?? task.status,
      due_date: value.dueDate ?? task.due_date
    };

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           due_date = $4,
           updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [updated.title, updated.description, updated.status, updated.due_date, taskId, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/* -------------------------------------------
   DELETE TASK
--------------------------------------------- */
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
