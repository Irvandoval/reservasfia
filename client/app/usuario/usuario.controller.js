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
        controller: 'NuevoUsuarioCtrl',
        size: 'lg'
      });
     }

      $scope.editarUsuario = function(usuario){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-usuario.html',
      controller: 'EditarUsuarioCtrl',
      size: 'lg',
      resolve: {
        usuario: function() {
          return usuario;
        }
      }
    });
   }

  })

.controller('NuevoUsuarioCtrl', function($scope, $modalInstance){
    
    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  })

  .controller('EditarUsuarioCtrl',function(usuario, $scope, $modalInstance){
    $scope.usuario = usuario;
    console.log($scope.usuario);
    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  })
