'use strict';

angular.module('reservasApp')
  .controller('RevisarSolicitudCtrl', function ($scope, $resource, ngTableParams, $filter, Actividad) {
     $scope.tableParams = new ngTableParams({
         page: 1,    // paginacion, primera en mostrar
         count: 5, // cantidad de elementos a mostrar por pagina
         sorting:{
          fechaCreacion: 'asc'
         }
     }, {
         total:0,
         getData: function ($defer, params) {
         Actividad.query().$promise
         .then(function(actividades){
          var orderedRecentActivity = params.filter() ?
                        $filter('orderBy')(actividades, params.orderBy()) :
                        actividades;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });

  });
