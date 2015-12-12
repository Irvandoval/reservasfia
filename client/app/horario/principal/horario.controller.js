'use strict';

angular.module('reservasApp')
  .controller('HorarioCtrl', function ($scope, $rootScope,$resource, ngTableParams, $filter, $modal, Auth) {
  $scope.esRepresentante = Auth.isRepresentante;
   $scope.tablaHorarios = new ngTableParams({
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
         })

     }
   });
      $scope.abrir = function(horario){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'horario-detalle.html',
      size: 'lg',
      controller: 'HorarioDetalleCtrl',
      resolve:{
       horario: function(){
        return horario;
       }
      }
    });
   };

$scope.periodoHorarios = function(){
 var hoy = new Date();
 var inicioH = new Date($rootScope.cicloActual.inicioSubidaHorario);
 var finH = new Date($rootScope.cicloActual.finSubidaHorario)
 if (hoy >= inicioH && hoy <= finH  )
 return true;
 else
 return false;
};
  })

  .controller('HorarioDetalleCtrl', function($scope, ngTableParams, $modalInstance, $filter, horario, $resource){
     $scope.horario =  horario;
   $scope.tablaHorarioDetalle = new ngTableParams({
    sorting: {nmateria: 'asc'}
   }, {
     counts: [],
     groupBy: function(grupo) {
       return grupo.nmateria +'       (' + grupo.materia.codigo + ')';
     },
     getData: function($defer, params) {
     $resource('/api/clases/horario/aprobados/:horarioId',{horarioId:'@id'})
      .query({horarioId: horario._id}).$promise
      .then(function(clases){
       var clasesor =  agregarNombreMateria(clases);
        $defer.resolve($filter('orderBy')(clasesor, params.orderBy()));
        $defer.resolve(clasesor);
      })
     }
   });

   function agregarNombreMateria(clases){
     for(var a = 0; a < clases.length; a++){
      clases[a].nmateria = clases[a].materia.nombre;
    }
    return clases;
   };

   $scope.cancel = function() {
     $modalInstance.dismiss('cancel');
   };

  })
