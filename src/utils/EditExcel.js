const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '..', '..', 'public', 'resources', 'Inventario del GitHub.xlsx');

async function updateExcel(repo) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found');
    return;
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  // Buscar la fila con el nombre del repositorio
  const rowIndex = data.findIndex(row => row['NOMBRE DEL REPOSITORIO'] === repo.name);
  if (rowIndex === -1) {
    console.error('Repository not found in Excel');
    return;
  }

  // Actualizar la fila con los nuevos datos
  data[rowIndex] = {
    'NOMBRE DEL REPOSITORIO': repo.name,
    'DESCRIPCIÓN': repo.description,
    'URL': repo.html_url,
    'FECHA DE CREACIÓN': repo.created_at,
    'LICENCIA DE DEPENDENCIA': repo.license,
    'ESTRUCTURA DE CARPETAS': repo.structure_file,
    'ARCHIVOS CLAVE': repo.key_files,
    'ARCHIVO README.md': repo.readme,
    'ARCHIVOS DE CONTRIBUCIÓN': repo.contributing,
    'BRANCH PRINCIPAL': repo.default_branch,
    'ESTRATEGIA DE RAMAS': repo.branches,
    'ULTIMO COMMIT': repo.last_commit,
    'ULTIMO RELEASE': repo.releases,
    'DEPENDENCIAS': repo.dependencies,
    'DEPENDENCIAS CON VULNERABILIDADES': repo.dependencies_problems,
    'REVISIÓN DE SEGURIDAD': repo.security,
    'PERMISOS': repo.access,
    'ACCESOS': repo.collaborators,
    'ARCHIVOS SENSIBLES': repo.sensitive_files,
    'ISSUES ABIERTOS': repo.issues,
    'PULL REQUEST ABIERTOS': repo.pull_requests,
    'DOCUMENTACIÓN DE CONTRIBUCIÓN': repo.contributing_document,
    'INTEGRACIÓN CONTINUA': repo.ci,
    'PRUEBAS QA': repo.qa,
    'SONARQUBE O HERRAMIENTAS DE CALIDAD': repo.sonar,
    'DESPLIEGUE AUTOMATICO': repo.cd,
    'ARCHIVO README.md_1': repo.readme2,
    'WIKI O PÁGINA DE GITHUB': repo.wiki,
    'EJEMPLO DE USO': repo.example,
    'GUIAS DE CONTRIBUCIÓN': repo.contributing_guide,
    'FORKs': repo.forks,
    'CONTRIBUCIONES ACTIVAS': repo.current_contributing,
    'ULTIMA ACTIVIDAD': repo.last_event,
    'FRECUENCIA DE ACTUALIZACIONES': repo.update_frequency,
    'PLAN DE DESACTIVACIÓN O ARCHIVADO': repo.archived_plan,
    'PRÓXIMOS PASOS O FEATURE': repo.future_steps,
    'COMENTARIOS GENERALES': repo.comments,
  };

  // Convertir los datos de nuevo a una hoja de cálculo y escribir el archivo
  const newSheet = xlsx.utils.json_to_sheet(data);
  workbook.Sheets[sheetName] = newSheet;
  xlsx.writeFile(workbook, filePath);
}

module.exports = { updateExcel };