import { CustomToolTip } from './components/CustomToolTip.js';

let tableData;

$(document).ready(function () {
  getAdGrid();
});

async function getAdGrid() {
  let repos = await fetch('/repos')
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
    });

  const gridOptions = {
    theme: agGrid.themeQuartz.withParams({
      accentColor: 'gray',
      headerBackgroundColor: 'cornflowerblue',
      columnBorder: { width: 1 }
    }),
    autoSizeStrategy: { type: 'fitCellContents' },
    suppressColumnVirtualisation: true,
    defaultColDef: {
      suppressMovable: true,
      wrapText: true,
      maxWidth: 500,
      cellStyle: { 'line-height': '1.5' },
      tooltipComponent: CustomToolTip
    },
    enableBrowserTooltips: true,
    rowHeight: 100,
    rowData: repos,
    columnDefs: [
      {
        headerName: 'Actualizar',
        field: 'update',
        pinned: 'left',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: params => {
          return `<button type="button" class="btn btn-outline-info"><i class="fa fa-refresh"></i></button>`;
        }
      },
      {
        headerName: 'Nombre',
        field: 'name',
        pinned: 'left',
        filter: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Descripción',
        field: 'description',
        autoHeight: true,
      },
      {
        headerName: 'URL',
        field: 'html_url',
        cellRenderer: params => {
          return `<a href="${params.value}" target="_blank">${new URL(params.value)}</a>`
        }
      },
      {
        headerName: 'Fecha de Creación',
        field: 'created_at',
        cellStyle: { 'text-align': 'center' }
      },
      { headerName: 'Licencia de dependencia', field: 'license' },
      {
        headerName: 'Estructura de Carpetas',
        field: 'structure_file',
        tooltipField: 'structure_file',
        //tooltipComponentParams: { type: 'structure_file' },
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      {
        headerName: 'Archivos Clave',
        field: 'key_files',
        tooltipField: 'key_files',
        //tooltipComponentParams: { type: 'key_files' },
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      { headerName: 'Archivo README.md', field: 'readme' },
      { headerName: 'Archivos de Contribución', field: 'contributing' },
      {
        headerName: 'Branch Principal',
        field: 'default_branch',
        cellStyle: { 'text-align': 'center' }
      },
      {
        headerName: 'Estrategia de Ramas',
        field: 'branches',
        tooltipField: 'branches',
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      { headerName: 'Último Commit', field: 'last_commit' },
      { headerName: 'Último Release', field: 'releases' },
      {
        headerName: 'Dependencias',
        field: 'dependencies',
        tooltipField: 'dependencies',
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      {
        headerName: 'Dependencias con Vulnerabilidades',
        field: 'dependencies_problems',
        tooltipField: 'dependencies_problems',
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      { headerName: 'Revisión de Seguridad', field: 'security' },
      { headerName: 'Permisos', field: 'access' },
      {
        headerName: 'Accesos',
        field: 'collaborators',
        tooltipField: 'collaborators',
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      {
        headerName: 'Archivos Sensibles',
        field: 'sensitive_files',
        tooltipField: 'sensitive_files',
        cellRenderer: params => {
          return `${formatText(params.value)}`;
        }
      },
      { headerName: 'Issues Abiertos', field: 'issues' },
      { headerName: 'Pull Request Abiertos', field: 'pull_requests' },
      { headerName: 'Documentación de Contribución', field: 'contributing_document' },
      { headerName: 'Integración Continua', field: 'ci' },
      { headerName: 'Pruebas QA', field: 'qa' },
      { headerName: 'SonarQube o Herramientas de Calidad', field: 'sonar' },
      { headerName: 'Despliegue Automático', field: 'cd' },
      { headerName: 'Archivo README.md', field: 'readme2', autoHeight: true },
      { headerName: 'Wiki o Página de GitHub', field: 'wiki' },
      { headerName: 'Ejemplo de Uso', field: 'example' },
      { headerName: 'Guías de Contribución', field: 'contributing_guide' },
      { headerName: 'Forks', field: 'forks' },
      { headerName: 'Contribuciones Activas', field: 'current_contributing' },
      { headerName: 'Última Actividad', field: 'last_event' },
      { headerName: 'Frecuencia de Actualizaciones', field: 'update_frequency' },
      { headerName: 'Plan de Desactivación o Archivado', field: 'archived_plan' },
      { headerName: 'Próximos Pasos o Feature', field: 'future_steps' },
      { headerName: 'Comentarios Generales', field: 'comments', autoHeight: true },
    ],
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };

  const myGrid = document.getElementById('myGrid');
  const gridApi = agGrid.createGrid(myGrid, gridOptions);
}

function formatText(text) {
  try {
    if (text == 'Repositorio vacío') {
      return text;
    }
    return text.replace(/\n/g, '<br>');
  } catch (error) {
    console.error(`Error en el formato de texto de ${text}`);
    return 'El contenido de la celda no se pudó formatear, puede que la celda está vacía en el archivo de Excel.';
  }
}