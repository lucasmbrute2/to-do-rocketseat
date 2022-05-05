const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const res = require("express/lib/response");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const payload = {
    id: uuid(),
    name,
    username,
    todos: [],
  };

  users.push(payload);
  response.status(201).json(payload);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const currUser = users.find((user) => (user.username = username));

  response.send(currUser.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const currUser = users.find((user) => (user.username = username));
  const todoObj = {
    id: uuid(),
    title,
    done: false,
    created_at: new Date(),
    deadline: new Date(deadline),
  };

  currUser.todos.push(todoObj);

  response.status(201).json(todoObj);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const currTodo = currUser.forEach((todo) => todo.id === id);

  const editedTodo = { ...currTodo, title, deadline };

  response.status(200).json(editedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const todoToBeEdited = currUser.forEach((todo) => todo.id === id);

  todoToBeEdited.done = true;

  response.status(200).json({ todoToBeEdited });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const todoToBeDeleted = currUser.find((todo) => todo.id === id);

  users.splice(todoToBeDeleted, 1);

  response
    .status(200)
    .json({ users, message: `User ${username} deleted with success!` });
});

module.exports = app;
