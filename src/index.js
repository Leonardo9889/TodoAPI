const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const findUsers = users.find((user) => user.username === username)

  if (!findUsers) {
    return response.status(400).json({ error: 'User not found!!!' })
  }

  request.findUsers = findUsers

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlrearyExists = users.some((user) => user.username === username)
  if (userAlrearyExists) {
    return response.status(400).json({ error: 'User already exists!!!' })
  }

  const createUser = {
    id: uuidv4(),
    name,
    username,
    todo: []
  }

  users.push(createUser)

  return response.status(201).json(createUser)
});

app.get('/usersList', (request, response) => {

  return response.json(users)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { findUsers } = request

  const createTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  findUsers.todo.push(createTodo)

  return response.status(201).json(createTodo)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { findUsers } = request

  return response.json(findUsers.todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { findUsers } = request
  const { title, deadline } = request.body

  const existiTodo = findUsers.todo.find((todo) => todo.id === id)

  if(!existiTodo){
    return response.status(404).json({error: 'Todo Not Found'})
  }

  existiTodo.title = title
  existiTodo.deadline = new Date(deadline)

  return response.json(existiTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { findUsers } = request

  const existiTodo = findUsers.todo.find((todo) => todo.id === id)

  if(!existiTodo){
    return response.status(404).json({error: 'Todo Not Found'})
  }
 
  existiTodo.done = true
  return response.json(existiTodo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { findUsers } = request

  const existiTodo = findUsers.todo.findIndex((todo) => todo.id === id)

  if(existiTodo === -1){
    return response.status(404).json({error: 'Todo Not Found'})
  }

  findUsers.todo.splice(existiTodo, 1)

  return response.status(204).json()

});

module.exports = app;