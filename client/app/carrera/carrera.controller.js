

'use strict';

angular.module('reservasApp')
  .controller('CarreraCtrl', function ($scope, $resource, ngTableParams, $filter, Carrera, $modal) {
   $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Carrera.query().$promise
         .then(function(carreras){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(carreras, params.filter()) :
                        aulas;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
   $scope.nuevaCarrera = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nueva-carrera.html',
      controller: 'NuevaCarreraCtrl',
      size: 'lg'
    });
   }
   $scope.editarCarrera = function(carrera){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-carrera.html',
      controller: 'EditarCarreraCtrl',
      size: 'lg',
      resolve: {
        aula: function() {
          return carrera;
        }
      }
    });
   }
  })

  .controller('NuevaCarreraCtrl', function(){

  })

  .controller('EditarCarreraCtrl',function(carrera, $scope){
    $scope.carrera = carrera;
    console.log($scope.carrera);
  })
