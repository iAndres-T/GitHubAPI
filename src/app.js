const express = require('express');
const path = require('path');
const { fetchAllRepos, updateRepository, uploadRepository } = require('./RepositoriesHyG');

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
    const updatedRepo = req.body.in_excel ? await updateRepository(req.body) : await uploadRepository(req.body);
    res.json(updatedRepo);
  } catch (error) {
    console.error('Error al actualizar excel', error);
    res.status(500).json({ message: error });
  }
});


app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});