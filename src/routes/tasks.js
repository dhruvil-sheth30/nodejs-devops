const express = require('express');
const router = express.Router();
const db = require('../config/db');
const logger = require('../utils/logger');
const auth = require('../middleware/auth'); // You'll need to create this

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;