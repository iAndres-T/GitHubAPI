const express = require('express');
const { fetchAllRepos } = require('./RepositoriesHyG');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/repos', async (req, res) => { 

  try {
    const repos = await fetchAllRepos();
    res.json(repos);
  } catch (error) {
    console.error('Error al obtener repositorios', error);
    res.status(500).json({ error: 'Error fetching repos' });
  }
});
  

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});