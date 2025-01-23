const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'public', 'resources' ,'Inventario del GitHub.xlsx');

function readExcel() {
  if (!fs.existsSync(filePath)) {
    console.error('File not found');
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { range: 5 });
  let json = data.slice(0, 2);
  json = json.map(fila => { 
    return {
      name: fila['NOMBRE DEL REPOSITORIO'],
      description: fila['DESCRIPCIÓN'],
      html_url: fila['URL'],
      created_at: formatText(fila['FECHA DE CREACIÓN'], 'date'),
      license: fila['LICENCIA DE DEPENDENCIA'],
      structure_file: formatText(fila['ESTRUCTURA DE CARPETAS'], 'enter'),
      key_files: formatText(fila['ARCHIVOS CLAVE'], 'enter'),
      readme: fila['ARCHIVO README.md'],
      contributing: fila['ARCHIVOS DE CONTRIBUCIÓN'],
      default_branch: fila['BRANCH PRINCIPAL'],
      branches: formatText(fila['ESTRATEGIA DE RAMAS'], 'both'),
      last_commit: fila['ULTIMO COMMIT'],
      releases: fila['ULTIMO RELEASE'],
      dependencies: formatText(fila['DEPENDENCIAS'], 'enter'),
      dependencies_problems: fila['DEPENDENCIAS CON VULNERABILIDADES'],
      security: fila['REVISIÓN DE SEGURIDAD'],
      access: formatText(fila['PERMISOS'], 'dot'),
      collaborators: formatText(fila['ACCESOS'], 'both'),
      sensitive_files: formatText(fila['ARCHIVOS SENSIBLES'], 'enter'),
      issues: fila['ISSUES ABIERTOS'],
      pull_requests: fila['PULL REQUEST ABIERTOS'],
      contributing_document: fila['DOCUMENTACIÓN DE CONTRIBUCIÓN'],
      ci: fila['INTEGRACIÓN CONTINUA'],
      qa: fila['PRUEBAS QA'],
      sonar: fila['SONARQUBE O HERRAMIENTAS DE CALIDAD'],
      cd: fila['DESPLIEGUE AUTOMATICO'],
      wiki: fila['WIKI O PÁGINA DE GITHUB'],
      example: fila['EJEMPLO DE USO'],
      contributing_guide: fila['GUIAS DE CONTRIBUCIÓN'],
      forks: fila['FORKs'],
      current_contributing: fila['CONTRIBUCIONES ACTIVAS'],
      last_event: formatText(fila['ULTIMA ACTIVIDAD'], 'enter'),
      update_frequency: fila['FRECUENCIA DE ACTUALIZACIONES'],
      archived_plan: fila['PLAN DE DESACTIVACIÓN O ARCHIVADO'],
      future_steps: fila['PRÓXIMOS PASOS O FEATURE'],
      comments: formatText(fila['COMENTARIOS GENERALES'], 'dot')
    }
  });
  //console.log(json.slice(0, 1));
  return json.slice(0, 1);
}

function excelDateToJSDate(serial) {
  // Fecha base de Excel (1900)
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 86400000); // 86400000 ms en un día
}

function formatText(text, type) {
  switch (type) {
    case 'enter':
      return text.replace(/\n/g, '<br>');
    case 'dash':
      return text.replace(/- /g, '');
    case 'both':
      return text.replace(/\n/g, '<br>').replace(/- /g, '');
    case 'dot':
      return text.replace(/\. /g, '<br>');
    case 'date':
      return excelDateToJSDate(text).toISOString().split('T')[0];
  }
}

module.exports = { readExcel };

readExcel();