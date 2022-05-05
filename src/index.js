const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const res = require("express/lib/response");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const isUsernameAlreadyCreated = users.findIndex(
    (user) => user?.username === username
  );

  if (isUsernameAlreadyCreated === -1)
    return response.status(404).json({ error: "Username not found." });

  request.username = username;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const isUsernameAlreadyCreated = users.findIndex(
    (user) => user?.username === username
  );

  if (isUsernameAlreadyCreated !== -1)
    return response.status(400).json({ error: "Mensagem do erro" });

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
  const { username } = request;
  const currUser = users.find((user) => user.username === username);

  if (!currUser)
    return response.status(404).json({ error: "Username not found." });

  return response.send(currUser.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;

  const currUser = users.find((user) => user.username === username);
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
  const { username } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const currTodo = currUser.todos.findIndex((todo) => todo.id === id);

  if (currTodo === -1)
    return response.status(404).json({ error: "To do could not be found." });

  const editedTodo = {
    ...currUser.todos[currTodo],
    title: title,
    deadline: deadline,
  };

  currUser.todos[currTodo] = editedTodo;
  return response.status(200).json(editedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const todoToBeEdited = currUser.todos.find((todo) => todo.id === id);

  if (!todoToBeEdited)
    return response.status(404).json({ error: "To do not found." });

  todoToBeEdited.done = true;

  return response.status(200).json(todoToBeEdited);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const currUser = users.find((user) => user.username === username);
  const todoToBeDeleted = currUser.todos.findIndex((todo) => todo.id === id);

  if (todoToBeDeleted === -1)
    return response.status(404).json({ error: "Not found" });

  currUser.todos.splice(users[todoToBeDeleted].todos, 1);

  return response.status(204);
});

module.exports = app;
