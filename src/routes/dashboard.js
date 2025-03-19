const router = require('express').Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');

//all todos and name

router.get('/', authorize, async (req,res) => {
    try {
        const user = await pool.query(
            'SELECT u.user_name, t.todo_id, t.description, t.due_date FROM users AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_id = $1',
            [req.user.id]
        );

        res.json(user.rows);

    } catch (err) {
        console.error(err.message);
    }
})

//create a todo

router.post('/todos', authorize, async (req,res) => {
    try {
        const { description, due_date } = req.body;
        const newTodo = await pool.query(
            'INSERT INTO todos (user_id, description, due_date) VALUES($1, $2, $3) RETURNING *',
            [req.user.id, description, due_date]
        );

        res.json(newTodo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
})

//update a todo

router.put('/todos/:id', authorize, async (req,res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query('UPDATE todos SET description = $1 WHERE todo_id = $2 AND user_id = $3',
            [description, id, req.user.id]
        )

        if(updateTodo.rowCount === 0) {
            return res.json('This todo is not yours');
        }

        res.json('Todo was updated');
    } catch (err) {
        console.error(err.message);
    }
})

//delete a todo

router.delete('/todos/:id', authorize, async (req,res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query('DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);

        if(deleteTodo.rowCount === 0) {
            return res.json('This todo is not yours');
        }

        res.json('Todo was deleted')
    } catch (err) {
        console.error(err.message);
    }
})

// Post done todo
router.post('/done', authorize, async (req, res) => {
    try {

        console.log('Request Body:', req.body);

        
        const { todo_id, description, due_date } = req.body;
        const userId = req.user.id;

        const todoIdInt = parseInt(todo_id, 10);
        if (isNaN(todoIdInt)) {
            return res.status(400).json({ error: 'Invalid todo_id format' });
        }

        // ตรวจสอบว่ามี todo นี้อยู่จริง และเป็นของ user คนนี้หรือไม่
        const checkTodo = await pool.query(
            'SELECT * FROM todos WHERE todo_id = $1 AND user_id = $2',
            [todo_id, userId]
        );

        
        

        if (checkTodo.rowCount === 0) {
            return res.status(404).json({ error: 'Todo not found or does not belong to the user' });
        }

        // ย้าย todo ไปยัง done_todos
        await pool.query(
            'INSERT INTO done_todos (todo_id, description, due_date, completed_at, user_id) VALUES ($1, $2, $3, NOW(), $4)',
            [todo_id, description, due_date, userId]
        );

        // ลบ todo ออกจากตาราง todos
        const deleteTodo = await pool.query('DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 RETURNING *', [todo_id, userId]);

        if(deleteTodo.rowCount === 0) {
            return res.json('This todo is not yours');
        }

        res.json({ message: 'Todo marked as done' });
    } catch (err) {
        console.error('Error in POST /done:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

  

// Get all done todos
router.get('/done', authorize, async (req, res) => {
  try {
    const userId = req.user.id;
    const doneTodos = await pool.query(
      'SELECT * FROM done_todos WHERE user_id = $1 ORDER BY due_date ASC',
      [userId]
    );

    res.json(doneTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

// Delete a done todo
router.delete('/done/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleteDoneTodo = await pool.query(
      'DELETE FROM done_todos WHERE todo_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (deleteDoneTodo.rowCount === 0) {
      return res.status(404).json('This done todo is not yours');
    }

    res.json('Done todo deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;

