const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '..', '..', 'public', 'resources', 'Inventario del GitHub.xlsx');

async function updateExcel(repo) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Archivo no encontrado');
  }

  // Cargar el archivo Excel
  const workbook = await XlsxPopulate.fromFileAsync(filePath);
  const sheet = workbook.sheet(0);

  // Buscar la fila con el nombre del repositorio (columna B desde la fila 7 en adelante)
  let targetRow = null;
  for (let row = 7; row <= sheet.usedRange().endCell().rowNumber(); row++) {
    if (sheet.cell(`B${row}`).value() === repo.name) {
      targetRow = row;
      break;
    }
  }

  if (targetRow === null) {
    throw new Error('Repositorio no encontrado en Excel');
  }

  // Mapeo de columnas basado en los títulos (columna B en adelante)
  const columns = {
    'C': repo.description,
    'H': repo.license,
    'K': repo.readme,
    'L': repo.contributing,
    'M': repo.default_branch,
    'N': repo.branches,
    'O': repo.last_commit,
    'P': repo.releases,
    'U': repo.collaborators,
    'X': repo.pull_requests,
    'AD': repo.readme2,
    'AH': repo.forks,
    'AJ': repo.last_event
  };

  // Actualizar solo las celdas correspondientes
  for (const [col, value] of Object.entries(columns)) {
    sheet.cell(`${col}${targetRow}`).value(value);
  }

  // Guardar el archivo
  await workbook.toFileAsync(filePath);
}

module.exports = { updateExcel };
