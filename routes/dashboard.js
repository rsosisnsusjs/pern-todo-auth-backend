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

module.exports = router;
