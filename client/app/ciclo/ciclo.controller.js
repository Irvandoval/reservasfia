'use strict';

angular.module('reservasApp')
  .controller('CicloCtrl', function ($scope, $modal) {
   $scope.nuevoCiclo = function(){

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nuevo-ciclo.html',
      size: 'lg'
    });
   };
  });

  $scope.editarCiclo = function(ciclo){
   var modalInstance = $modal.open({
     animation: $scope.animationsEnabled,
     templateUrl: 'editar-ciclo.html',
     controller: 'EditarCicloCtrl',
     size: 'lg',
     resolve: {
       aula: function() {
         return ciclo;
       }
     }
   });
  }
  })

  .controller('EditarCicloCtrl',function(ciclo, $scope){
    $scope.ciclo = ciclo;
    console.log($scope.ciclo);
  })
