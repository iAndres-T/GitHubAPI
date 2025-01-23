let tableData;

$(document).ready(function () {
  getAdGrid();
  //getExcelTable();
  //getTable();
});

function getTable() {

  if (tableData) {
    tableData.destroy();
  }

  tableData = $('#reposTable').DataTable({
    resonsive: true,
    ajax: {
      url: '/repos',
      type: 'GET',
      dataType: 'json',
      dataSrc: ''
    },
    columns: [
      { data: 'name' },
      { data: 'description' },
      { 
        data: 'html_url',
        render: function(data) {
          return '<a href="' + data + '" target="_blank">' + data + '</a>';
        }
      },
      { data: 'created_at' },
      { data: 'license' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'readme' },
      { data: 'contributing' },
      { data: 'default_branch' },
      { data: 'branches' },
      { data: 'last_commit' },
      { data: 'releases' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'access' },
      { data: 'collaborators' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'pull_requests' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'readme' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Validar en el README' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'forks' },
      { defaultContent: 'Verificar Manualmente' },
      { data: 'last_event' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
      { defaultContent: 'Verificar Manualmente' },
    ],
    order: [[0, 'asc']],
    dom: 'Bfrtip',
    buttons: ['pageLength'],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
    },
    error: function (xhr, error, thrown) {
      console.log('Error fetching repositories:', error);
    }
  });
}

function getExcelTable() {
  if (tableData) {
    tableData.destroy();
  }

  tableData = $('#reposTable').DataTable({
    resonsive: true,
    ajax: {
      url: '/repos',
      type: 'GET',
      dataType: 'json',
      dataSrc: ''
    },
    columns: [
      { data: 'name' },
      { data: 'description' },
      {
        data: 'html_url',
        render: function (data) {
          return '<a href="' + data + '" target="_blank">' + data + '</a>';
        }
      },
      { data: 'created_at' },
      { data: 'license' },
      {
        data: 'structure_file',
        createdCell: function (td) {
          $(td).css('text-align', 'left');
        }
      },
      { data: 'key_files' },
      { data: 'readme' },
      { data: 'contributing' },
      { data: 'default_branch' },
      { data: 'branches' },
      { data: 'last_commit' },
      { data: 'releases' },
      { data: 'dependencies' },
      { data: 'dependencies_problems' },
      { data: 'security' },
      { data: 'access' },
      { data: 'collaborators' },
      { data: 'sensitive_files' },
      { data: 'issues' },
      { data: 'pull_requests' },
      { data: 'contributing_document' },
      { data: 'ci' },
      { data: 'qa' },
      { data: 'sonar' },
      { data: 'cd' },
      { data: 'readme' },
      { data: 'wiki' },
      { data: 'example' },
      { data: 'contributing_guide' },
      { data: 'forks' },
      { data: 'current_contributing' },
      { data: 'last_event' },
      { data: 'update_frequency' },
      { data: 'archived_plan' },
      { data: 'future_steps' },
      { data: 'comments' },
    ],
    order: [[0, 'asc']],
    dom: 'Bfrtip',
    buttons: ['pageLength'],
    lenguage: {
      url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
    },
    error: function (xhr, error, thrown) {
      console.log('Error fetching repositories:', error);
    }
  });
}

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
    theme: agGrid.themeQuartz.withParams({ accentColor: 'gray', headerBackgroundColor: 'cornflowerblue' }),
    autoSizeStrategy: { type: 'fitCellContents' },
    defaultColDef: { suppressMovable: true},
    rowData: repos,
    columnDefs: [
      { headerName: 'Nombre', field: 'name', sortable: true, filter: true},
      { headerName: 'Descripción', field: 'description' },
      { headerName: 'URL', field: 'html_url' },
      { headerName: 'Fecha de Creación', field: 'created_at' },
      { headerName: 'Licencia', field: 'license' },
      { headerName: 'Estructura de Carpetas', field: 'structure_file', wrapText: true},
      { headerName: 'Archivos Clave', field: 'key_files' },
      { headerName: 'README', field: 'readme' },
      { headerName: 'Archivos de Contribución', field: 'contributing' },
      { headerName: 'Branch Principal', field: 'default_branch' },
      { headerName: 'Estrategia de Ramas', field: 'branches' },
      { headerName: 'Último Commit', field: 'last_commit' },
      { headerName: 'Último Release', field: 'releases' },
      { headerName: 'Dependencias', field: 'dependencies' },
      { headerName: 'Dependencias con Vulnerabilidades', field: 'dependencies_problems' },
      { headerName: 'Revisión de Seguridad', field: 'security' },
      { headerName: 'Permisos', field: 'access' },
      { headerName: 'Accesos', field: 'collaborators' },
      { headerName: 'Archivos Sensibles', field: 'sensitive_files' },
      { headerName: 'Issues Abiertos', field: 'issues' },
      { headerName: 'Pull Request Abiertos', field: 'pull_requests' },
      { headerName: 'Documentación de Contribución', field: 'contributing_document' },
      { headerName: 'Integración Continua', field: 'ci' },
      { headerName: 'Pruebas QA', field: 'qa' },
      { headerName: 'SonarQube o Herramientas de Calidad', field: 'sonar' },
      { headerName: 'Despliegue Automático', field: 'cd' },
      { headerName: 'Wiki o Página de GitHub', field: 'wiki' },
      { headerName: 'Ejemplo de Uso', field: 'example' },
      { headerName: 'Guías de Contribución', field: 'contributing_guide' },
      { headerName: 'Forks', field: 'forks' },
      { headerName: 'Contribuciones Activas', field: 'current_contributing' },
      { headerName: 'Última Actividad', field: 'last_event' },
      { headerName: 'Frecuencia de Actualizaciones', field: 'update_frequency' },
      { headerName: 'Plan de Desactivación o Archivado', field: 'archived_plan' },
      { headerName: 'Próximos Pasos o Feature', field: 'future_steps' },
      { headerName: 'Comentarios Generales', field: 'comments' }
    ],
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };
  
  const myGrid = document.getElementById('myGrid');
  const gridApi = agGrid.createGrid(myGrid, gridOptions);
  //agGrid.createGrid(myGrid, gridOptions);
}