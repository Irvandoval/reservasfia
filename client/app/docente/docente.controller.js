'use strict';

angular.module('reservasApp')
  .controller('DocenteCtrl', function ($scope, $resource, ngTableParams, $filter, Docente, $modal) {
    $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 5          // count per page
      }, {
          total:0,
          getData: function ($defer, params) {
          Docente.query().$promise
          .then(function(docentes){
           var orderedRecentActivity = params.filter() ?
                         $filter('filter')(docentes, params.filter()) :
                         docentes;
              params.total(orderedRecentActivity.length);
              $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

          }
      });
    $scope.nuevoDocente = function(){
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'nuevo-docente.html',
       size: 'lg'
     });
    }

  });
