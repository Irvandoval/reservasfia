'use strict';
(function(){

 function HorarioCtrl($rootScope, $resource, NgTableParams, $filter, $modal, Auth) {
   var self =  this;
   self.periodoHorarios = false;
    $resource('/api/ciclos/por_fecha/actual')
 .get(function(ciclo){
  var hoy = new Date();
  var inicioH = new Date(ciclo.inicioSubidaHorario);
  var finH = new Date(ciclo.finSubidaHorario);
  if (hoy >= inicioH && hoy <= finH) {
    self.periodoHorarios =  true;
  }else{
   self.periodoHorarios =  false;
  }
 });
    self.esRepresentante = Auth.isRepresentante;
    self.tablaHorarios = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'asc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        $resource('/api/horarios').query().$promise
          .then(function(horarios) {
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(horarios, params.orderBy()) :
              horarios;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });
    self.horarioDetalle = function(horario) {
      $modal.open({
        animation: true,
        templateUrl: 'horario-detalle.html',
        size: 'lg',
        controller: 'HorarioDetalleCtrl',
        resolve: {
          horario: function() {
            return horario;
          }
        }
      });
    };
  }

  function HorarioDetalleCtrl($scope, NgTableParams, $modalInstance, $filter, horario, $resource) {
  $scope.horario = horario;
  $scope.tablaHorarioDetalle = new NgTableParams({
    sorting: {
      nmateria: 'asc'
    }
  }, {
    counts: [],
    groupBy: function(grupo) {
      return grupo.nmateria + '       (' + grupo.materia.codigo + ')';
    },
    getData: function($defer, params) {
      $resource('/api/clases/horario/aprobados/:horarioId', {
          horarioId: '@id'
        })
        .query({
          horarioId: horario._id
        }).$promise
        .then(function(clases) {
          var clasesor = agregarNombreMateria(clases);
          $defer.resolve($filter('orderBy')(clasesor, params.orderBy()));
          $defer.resolve(clasesor);
        });
    }
  });

  function agregarNombreMateria(clases) {
    for (var a = 0; a < clases.length; a++) {
      clases[a].nmateria = clases[a].materia.nombre;
    }
    return clases;
  }

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

}

angular.module('reservasApp')
  .controller('HorarioCtrl', HorarioCtrl )
  .controller('HorarioDetalleCtrl', HorarioDetalleCtrl);

})();
