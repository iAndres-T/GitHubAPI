const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'public', 'resources' ,'Inventario del GitHub.xlsx');

function readExcel() {
  console.log(filePath);
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
      created_at: excelDateToJSDate(fila['FECHA DE CREACIÓN']).toDateString(),
      license: fila['LICENCIA DE DEPENDENCIA'],
      structure_file: 'Estructura...',//fila['ESTRUCTURA DE CARPETAS'],
      key_files: fila['ARCHIVOS CLAVE'],
      readme: fila['ARCHIVO README.md'],
      contributing: fila['ARCHIVOS DE CONTRIBUCIÓN'],
      default_branch: fila['BRANCH PRINCIPAL'],
      branches: fila['ESTRATEGIA DE RAMAS'],
      last_commit: fila['ULTIMO COMMIT'],
      releases: fila['ULTIMO RELEASE'],
      dependencies: fila['DEPENDENCIAS'],
      dependencies_problems: fila['DEPENDENCIAS CON VULNERABILIDADES'],
      security: fila['REVISIÓN DE SEGURIDAD'],
      access: fila['PERMISOS'],
      collaborators: fila['ACCESOS'],
      sensitive_files: fila['ARCHIVOS SENSIBLES'],
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
      last_event: fila['ULTIMA ACTIVIDAD'],
      update_frequency: fila['FRECUENCIA DE ACTUALIZACIONES'],
      archived_plan: fila['PLAN DE DESACTIVACIÓN O ARCHIVADO'],
      future_steps: fila['PRÓXIMOS PASOS O FEATURE'],
      comments: fila['COMENTARIOS GENERALES']
    }
  });
  console.log(json[0]);

}

function excelDateToJSDate(serial) {
  // Fecha base de Excel (1900)
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 86400000); // 86400000 ms en un día
}

module.exports = { readExcel };

readExcel();