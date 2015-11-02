'use strict';

angular.module('reservasApp')
  .controller('CicloCtrl', function ($scope, $resource, ngTableParams, $filter, Ciclo, $modal) {
   $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Aula.query().$promise
         .then(function(ciclos){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(ciclos, params.filter()) :
                        ciclos;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
   $scope.nuevaCiclo = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nuevo-ciclo.html',
      controller: 'NuevoCicloCtrl',
      size: 'lg'
    });
   }

   $scope.editarCiclo = function(ciclo){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-ciclo.html',
      controller: 'EditarCicloCtrl',
      size: 'lg',
      resolve: {
        aula: function() {
          return aula;
        }
      }
    });
   }



  .controller('NuevoCicloCtrl', function(){

  })

  .controller('EditarCicloCtrl',function(ciclo, $scope){
    $scope.ciclo = ciclo;
    console.log($scope.ciclo);
  })
