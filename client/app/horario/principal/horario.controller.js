'use strict';

angular.module('reservasApp')
  .controller('HorarioCtrl', function ($scope, $resource, ngTableParams, $filter, $modal) {
   
      $scope.abrir = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'horario-detalle.html',
      size: 'lg'
    });
   };
    
  });
