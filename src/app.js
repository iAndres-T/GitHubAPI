const express = require('express');
const path = require('path');
const { fetchAllRepos, updateRepository } = require('./RepositoriesHyG');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.get('/repos', async (req, res) => {

  try {
    const repos = await fetchAllRepos();
    res.json(repos);
  } catch (error) {
    console.error('Error al obtener repositorios', error);
    res.status(500).json({ error: 'Error fetching repos' });
  }
});

app.post('/update', async (req, res) => {
  try {
    const updatedRepo = await updateRepository(req.body);
    res.json(updatedRepo);
  } catch (error) {
    console.error('Error al actualizar repositorios', error);
    res.status(500).json({ error: 'Error fetching repos' });
  }
});


app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});