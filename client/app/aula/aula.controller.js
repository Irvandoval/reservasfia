'use strict';

angular.module('reservasApp')
  .controller('AulaCtrl', function ($scope, $resource, ngTableParams, $filter, Aula, $modal) {
   $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Aula.query().$promise
         .then(function(aulas){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(aulas, params.filter()) :
                        aulas;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });

   $scope.nuevaAula = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nueva-aula.html',
      controller: 'NuevaAulaCtrl',
      size: 'lg'
    });
   }

 

   $scope.editarAula = function(aula){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-aula.html',
      controller: 'EditarAulaCtrl',
      size: 'lg',
      resolve: {
        aula: function() {
          return aula;
        }
      }
    });
   }


  .controller('NuevaAulaCtrl', function(){

  })

  .controller('EditarAulaCtrl',function(aula, $scope, $modalInstance){
    $scope.aula = aula;
    console.log($scope.aula);
    
      $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
  };
  })

