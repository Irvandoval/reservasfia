
// Para que Don Invin no me diga que soy tacaña con las palabras xD
'use strict';

angular.module('reservasApp')
  .controller('AulaCtrl', function ($scope, $resource, ngTableParams, $filter, Aula) {
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

  });
