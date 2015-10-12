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
