const fastify = require("fastify");

const app = fastify({ logger: true });
const PORT = 3000;

let todos = [
  {
    id: 1,
    name: "Learn LaTeX",
    isCompleted: false,
  },
  {
    id: 2,
    name: "Learn Rust",
    isCompleted: false,
  },
];

app.get("/", () => {
  return "Hello, World!";
});

app.get("/api/todos/:id", (req, _reply) => {
  const { id } = req.params;
  const todo = todos.filter(t => t.id === +id);
  return {
    status: 200,
    msg: "Successfully retrieved a todo with an id of " + id,
    data: todo,
  };
});

app.get("/api/todos", (_req, _reply) => {
  return {
    status: 200,
    msg: "Successfully retrieved all todos.",
    data: todos,
  };
});

app.post("/api/todos", (req, _reply) => {
  const { name } = req.body;

  // generate a random ID and add the new todo to the list
  const id = Math.floor(Math.random() * 100);
  const item = { id, name, isCompleted: false };
  todos.push(item);

  return {
    status: 201,
    msg: "Successfully created a todo with an id of " + id,
    data: [],
  };
});

app.put("/api/todos/:id", (req, _reply) => {
  const { id } = req.params;
  const { name, isCompleted } = req.body;

  // find the todo to modify
  const old = todos.find(t => t.id === +id);

  // create a new todo item with fallback value if no new value is provided
  const item = {
    id: old.id,
    name: name || old.name,
    isCompleted: isCompleted || old.isCompleted,
  };

  // replace the old items with the new one with modified field(s)
  todos = todos.filter(t => t.id !== +id).concat(item);

  return {
    status: 200,
    msg: "Successfully updated a todo with an id of " + id,
    data: [],
  };
});

app.delete("/api/todos/:id", (req, _reply) => {
  const { id } = req.params;

  // replace the old items *without* the deleted item
  todos = todos.filter(t => t.id !== +id);

  return {
    status: 200,
    msg: "Successfully deleted a todo with an id of " + id,
    data: [],
  };
});

(async () => {
  try {
    await app.listen(PORT);
    console.log(`App is running on: http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
