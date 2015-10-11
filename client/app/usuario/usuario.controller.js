'use strict';

angular.module('reservasApp')
  .controller('UsuarioCtrl', function ($scope, ngTableParams, $filter, Usuario, $modal) {
   $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Usuario.query().$promise
         .then(function(usuarios){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(usuarios, params.filter()) :
                        usuarios;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });

     $scope.nuevoUsuario = function(){
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-usuario.html',
        size: 'lg'
      });
     };
  });
