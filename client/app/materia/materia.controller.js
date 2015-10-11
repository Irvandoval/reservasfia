'use strict';

angular.module('reservasApp')
  .controller('MateriaCtrl', function ($scope, $resource, ngTableParams, $filter, Materia, $modal) {
      $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
        Materia.query().$promise
         .then(function(materias){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(materias, params.filter()) :
                        materias;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
    
  });
})