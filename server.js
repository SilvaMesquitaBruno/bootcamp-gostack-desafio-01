const express = require("express");

// Iniciando a aplicação e definindo a porta local
const app = express();
const port = 3001;

// Permitindo dados Json
app.use(express.json());

// Count Request
let countRequests = 0;

// Projetos
const projects = [];

// Middlewares
function CheckProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Projeto não existe" });
  }
  return next();
}

function logRequests(req, res, next) {
  countRequests++;

  console.log(`Numero de Requests: ${countRequests}`);

  next();
}

// Rotas
app.post("/projects", logRequests, (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  return res.json(projects);
});

app.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

app.put("/projects/:id", logRequests, CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", logRequests, CheckProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json({ message: "apagado com Sucesso" });
});

app.post("/projects/:id/tasks", logRequests, CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}`);
});
