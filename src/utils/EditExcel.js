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

async function uploadExcel(repo) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Archivo no encontrado');
  }

  // Cargar el archivo Excel
  const workbook = await XlsxPopulate.fromFileAsync(filePath);
  const sheet = workbook.sheet(0);

  // Determinar la siguiente fila vacía
  let lastRow;
  const maxRows = sheet.usedRange().endCell().rowNumber();
  for (let i = 7; i <= maxRows; i++) {
    if (!sheet.cell(`B${i}`).value()) {
      lastRow = i;
      break;
    }
  }

  // Combinar las celdas E y G en la nueva fila
  sheet.range(`D${lastRow}:E${lastRow}`).merged(true);
  sheet.range(`F${lastRow}:G${lastRow}`).merged(true);

  // Mapeo de columnas basado en los títulos (columna B en adelante)
  const columns = {
    'B': repo.name,
    'C': repo.description,
    'D': repo.html_url,
    'F': new Date(repo.created_at),
    'H': repo.license,
    'I': repo.structure_file,
    'J': repo.key_files,
    'K': repo.readme,
    'L': repo.contributing,
    'M': repo.default_branch,
    'N': repo.branches,
    'O': repo.last_commit,
    'P': repo.releases,
    'Q': repo.dependencies,
    'R': repo.dependencies_problems,
    'S': repo.security,
    'T': repo.access,
    'U': repo.collaborators,
    'V': repo.sensitive_files,
    'W': repo.issues,
    'X': repo.pull_requests,
    'Y': repo.contributing_document,
    'Z': repo.ci,
    'AA': repo.qa,
    'AB': repo.sonar,
    'AC': repo.cd,
    'AD': repo.readme2,
    'AE': repo.wiki,
    'AF': repo.example,
    'AG': repo.contributing_guide,
    'AH': repo.forks,
    'AI': repo.current_contributing,
    'AJ': repo.last_event,
    'AK': repo.update_frequency,
    'AL': repo.archived_plan,
    'AM': repo.future_steps,
    'AN': repo.comments
  };

  // Agregar los valores a la nueva fila
  for (const [col, value] of Object.entries(columns)) {
    const cell = sheet.cell(`${col}${lastRow}`);
    if (col === 'F' && value instanceof Date) {
      cell.value(value);
      cell.style("numberFormat", "dd/MM/yyyy");
    } else {
      cell.value(value);
    }
  }
  
  // Aplicar bordes a la fila
  sheet.range(`B${lastRow}:AN${lastRow}`).style("border", {
    top: { style: "thin", color: "808080" },
    bottom: { style: "thin", color: "808080" },
    left: { style: "thin", color: "808080" },
    right: { style: "thin", color: "808080" }
  });
  
  // Guardar el archivo
  await workbook.toFileAsync(filePath);
}

module.exports = { updateExcel, uploadExcel };
