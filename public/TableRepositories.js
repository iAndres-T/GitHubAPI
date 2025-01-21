let tableData;

$(document).ready(function () {
  getTable();
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