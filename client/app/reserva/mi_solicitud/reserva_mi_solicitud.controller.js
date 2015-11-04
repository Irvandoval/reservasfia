'use strict';

angular.module('reservasApp')
  .controller('ReservaMiSolicitudCtrl', function ($rootScope, $scope, $modal, $resource, ngTableParams, $filter, Actividad) {
   var actividades = [],
     i, j;
   $rootScope.enEspera = new ngTableParams({
     page: 1, // paginacion, primera en mostrar
     count: 15, // cantidad de elementos a mostrar por pagina
     sorting: {
       fechaCreacion: 'asc'
     }
   }, {
     total: 0,
     getData: function($defer, params) {
       Actividad.query({
           idActividad: 'misespera'
         }).$promise
         .then(function(actividadesProm) {
           actividades = actividadesProm;
           var orderedRecentActivity = params.filter() ?
             $filter('orderBy')(actividades, params.orderBy()) :
             actividades;
           params.total(orderedRecentActivity.length);
           $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

     }
   });

   $rootScope.aprobados = new ngTableParams({
     page: 1, // paginacion, primera en mostrar
     count: 15, // cantidad de elementos a mostrar por pagina
     sorting: {
       fechaCreacion: 'desc'
     }
   }, {
     total: 0,
     getData: function($defer, params) {
       Actividad.query({
           idActividad: 'misaprobados'
         }).$promise
         .then(function(actividades) {
           var orderedRecentActivity = params.filter() ?
             $filter('orderBy')(actividades, params.orderBy()) :
             actividades;
           params.total(orderedRecentActivity.length);
           $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

     }
   });


   $rootScope.desaprobados = new ngTableParams({
     page: 1, // paginacion, primera en mostrar
     count: 15, // cantidad de elementos a mostrar por pagina
     sorting: {
       fechaCreacion: 'desc'
     }
   }, {
     total: 0,
     getData: function($defer, params) {
       Actividad.query({
           idActividad: 'misdesaprobados'
         }).$promise
         .then(function(actividades) {
           var orderedRecentActivity = params.filter() ?
             $filter('orderBy')(actividades, params.orderBy()) :
             actividades;
           params.total(orderedRecentActivity.length);
           $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

     }
   });

   $scope.detalleReserva = function(idActividad, tipo) {
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'detalleReserva.html',
       controller: 'DetalleReservaCtrl',
       size: 'lg',
       resolve: {
         actividad: function() {
           return Actividad.get({
             idActividad: idActividad
           }).$promise
         },
         tipo: function(){return tipo}
       }
     });

     modalInstance.result.then(function(actividad) {
       console.log("entro al result");

     }, function() {
       //$log.info('Modal dismissed at: ' + new Date());

     });
   };
  });
