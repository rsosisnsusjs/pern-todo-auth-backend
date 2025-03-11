const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();


//Middleware

app.use(cors());
app.use(express.json());

//ROUTES//

app.use('/authentication', require('./routes/jwtAuth'));
app.use('/dashboard', require('./routes/dashboard'));


//create a todo
/*


//get all todos

app.get('/todos', async (req,res) => {
    try {
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a todo

app.get('/todos/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id]);
        
        res.json(todo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
})

//update a todo



//delete a todo


*/
app.listen(5000, () => {
    console.log('server has started on port 5000');
})