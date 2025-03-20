require('dotenv').config();
const axios = require('axios');
const { readExcel } = require('./utils/readExcel');
const { updateExcel } = require('./utils/EditExcel');

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKENHYG;
let allReposFromGit = [];

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is required');
  process.exit(1);
}

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
});

const apiFile = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.raw+json'
  }
});

async function getReposGit() {
  let page = 1;
  let repos = [];
  try {
    while (true) {
      const response = await api.get(`user/repos?type=member&per_page=100&page=${page}`);
      console.log('Rate Limit:', response.headers['x-ratelimit-limit']);
      console.log('Rate Limit Remaining:', response.headers['x-ratelimit-remaining']);
      console.log('Rate Limit Reset:', new Date(response.headers['x-ratelimit-reset'] * 1000).toLocaleString());

      if (!response.data || response.data.length === 0) break;

      repos = repos.concat(response.data);
      page++;

    }
    return repos;

    /*Propiedades de la respuesta
      name: string,
      owner.login: string, --> Nombre del usuario
      private: boolean,
      description: string,
      html_url: string,
      url: string, --> API URL
      forks_url: string,
      collaborators_url: string,
      issue_events_url: string,
      events_url: string,
      branches_url: string,
      contributors_url: string,
      commits_url: string,
      issues_url: string,
      releases_url: string,
      created_at: string,
      updated_at: string,
      pushed_at: string,
      forks_count: number,
      archived: boolean,
      disabled: boolean,
      license: object,
      open_issues: number,
      default_branch: string,
    */

  } catch (error) {
    console.error('Error fetching repos', error.response?.data || error.message);
  }
}

async function fetchAllRepos() {
  let allRepos = [];
  let reposExcel = readExcel();
  allReposFromGit = await getReposGit();
  let reposGit = allReposFromGit;

  reposExcel.forEach(repoExcel => {
    const matchingRepo = reposGit.find(repoGit => repoGit.name === repoExcel.name);
    if (matchingRepo && !repoExcel.is_archived) {
      const repoGitUpdatedAtDate = new Date(matchingRepo.updated_at.split('T')[0]);
      const repoExcelLastEventDate = new Date(repoExcel.last_event.split('\n')[0].split('/').reverse());
      if (repoGitUpdatedAtDate > repoExcelLastEventDate) {
        repoExcel.is_updated = false;
      }
      allRepos.push(repoExcel);
      reposGit = reposGit.filter(repoGit => repoGit.name !== matchingRepo.name);
    }
    else if (repoExcel.is_archived) {
      allRepos.push(repoExcel);
      reposGit = reposGit.filter(repoGit => repoGit.name !== repoExcel.name);
    }
    else {
      repoExcel.deleted = true;
      allRepos.push(repoExcel);
    }
  });

  reposGit = await Promise.all(
    reposGit.map(async (repo) => {
      return {
        name: repo.name,
        description: repo.description || 'No hay descripción',
        html_url: repo.html_url,
        created_at: formatDateToDDMMYY(repo.created_at),
        license: repo.license || 'No se evidencia',
        structure_file: 'Verificar manualmente',
        key_files: 'Verificar manualmente',
        readme: await sendPetition(repo.url + '/readme', 'file') ? 'Está presente' : 'No está presente',
        contributing: await sendPetition(repo.url + '/contents/CONTRIBUTING.md', 'file') ? 'Está presente' : 'No está presente',
        default_branch: repo.default_branch,
        branches: await sendPetition(repo.branches_url.split('{')[0], 'branches'),
        last_commit: await sendPetition(repo.commits_url.split('{')[0], 'commits'),
        releases: await sendPetition(repo.releases_url.split('{')[0], 'releases'),
        dependencies: 'Verificar manualmente',
        dependencies_problems: 'Verificar manualmente',
        security: 'Verificar manualmente',
        access: repo.private ? 'El repositorio es privado. Solo es accesible para colaboradores específicos.' : 'El repositorio es público. Cualquier persona puede verlo.',
        collaborators: await sendPetition(repo.collaborators_url.split('{')[0], 'collaborators'),
        sensitive_files: 'Verificar manualmente',
        issues: 'Verificar manualmente',
        pull_requests: repo.open_issues > 0 ? await sendPetition(repo.issues_url.split('{')[0], 'PR') : 'No hay pull request abiertos',
        contributing_document: 'Verificar manualmente',
        ci: 'Verificar manualmente',
        qa: 'Verificar manualmente',
        sonar: 'Verificar manualmente',
        cd: 'Verificar manualmente',
        readme2: 'Verificar manualmente',
        wiki: 'Verificar manualmente',
        example: 'Verificar manualmente',
        contributing_guide: 'Verificar manualmente',
        forks: repo.forks_count > 0 ? repo.forks_count : 'Ninguno',
        current_contributing: 'Verificar manualmente',
        last_event: await sendPetition(repo.events_url, 'events') || ` Sin actividad reciente. Última actividad en ${formatDateToDDMMYY(repo.updated_at)}`,
        update_frequency: 'Verificar manualmente',
        archived_plan: 'Verificar manualmente',
        future_steps: 'Verificar manualmente',
        comments: 'Verificar manualmente',
        is_archived: repo.archived,
        is_updated: true,
        deleted: false,
        in_excel: false
      };
    })
  );
  allRepos = allRepos.concat(reposGit);
  return allRepos;
}

async function sendPetition(url, type) {

  try {
    let response;

    switch (type) {
      case 'file':
        response = await apiFile.get(url);
        return response.data;
      case 'branches':
        response = await api.get(url);
        return response.data.map(branch => branch.name).join('\n');
      case 'commits':
        response = await api.get(url);
        response = response.data.map(res => ({
          author: res.commit.author.name,
          date: res.commit.author.date,
          message: res.commit.message
        }))[0];

        return `${formatDateToDDMMYY(response.date)}\n${response.message.includes('\n\n') ? response.message.replace(/\n\n/g, '\n') : response.message}\n${response.author}`;
      case 'releases':
        response = await api.get(url);
        if (response.data.length == 0)
          return 'No se ha hecho ningun release';
        response = response.data.map(release => ({ tag: release.tag_name, date: release.published_at }))[0];
        return `${response.tag}\n${formatDateToDDMMYY(response.date)}`;
      case 'collaborators':
        response = await api.get(url);
        return response.data.map(collab => collab.login).join('\n');
      case 'PR': //Pull Requests
        response = await api.get(url);
        response = response.data.map(pr => ({ title: pr.title, body: pr.body }));
        return response.map(pr => `${pr.title}: ${pr.body}`).join('\n');
      case 'events':
        response = await api.get(url);
        response = response.data.filter(event => event.type == 'PushEvent');
        if (response.length == 0)
          return null;
        response = response.map(event => ({
          branch: event.payload.ref.split('/')[2],
          date: event.created_at,
          author: event.actor.login
        }))[0];
        return `${formatDateToDDMMYY(response.date)}\nCommit por ${response.author}\n${response.branch}`;
    }

  }
  catch (error) {
    if (error.response?.status == 404) {
      return null;
    }
    console.error('Error fetching' + url, error.response?.data || error.message);
  }
}

async function updateRepository(repo) {
  const matchingRepo = allReposFromGit.find(repoGit => repoGit.name === repo.name);
  if (matchingRepo) {
    const results = await Promise.all([
      sendPetition(matchingRepo.url + '/readme', 'file'),
      sendPetition(matchingRepo.url + '/contents/CONTRIBUTING.md', 'file'),
      sendPetition(matchingRepo.branches_url.split('{')[0], 'branches'),
      sendPetition(matchingRepo.commits_url.split('{')[0], 'commits'),
      sendPetition(matchingRepo.releases_url.split('{')[0], 'releases'),
      sendPetition(matchingRepo.collaborators_url.split('{')[0], 'collaborators'),
      matchingRepo.open_issues > 0 ? sendPetition(matchingRepo.issues_url.split('{')[0], 'PR') : Promise.resolve('No hay pull request abiertos'),
      sendPetition(matchingRepo.events_url, 'events')
    ]);

    repo.description = matchingRepo.description || 'No hay descripción';
    repo.license = matchingRepo.license || 'No se evidencia';
    repo.readme = results[0] ? repo.readme : 'No está presente';
    repo.contributing = results[1] ? repo.contributing : 'No está presente';
    repo.default_branch = matchingRepo.default_branch != repo.default_branch ? matchingRepo.default_branch : repo.default_branch;
    repo.branches = results[2];
    repo.last_commit = results[3];
    repo.releases = results[4];
    repo.collaborators = results[5];
    repo.pull_requests = results[6];
    repo.readme2 = repo.readme;
    repo.forks = matchingRepo.forks_count > 0 ? matchingRepo.forks_count : 'Ninguno';
    repo.last_event = results[7] || `Sin actividad reciente. Última actividad en ${formatDateToDDMMYY(matchingRepo.updated_at)}`;
  }

  try {
    await updateExcel(repo);
    repo.is_updated = true;
  } catch (error) {
    throw new Error('Error al actualizar el archivo Excel');
  }

  return repo;
}

function formatDateToDDMMYY(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

module.exports = { fetchAllRepos, updateRepository };


fetchAllRepos(); // Habilitar si se quiere probar la función en consola
