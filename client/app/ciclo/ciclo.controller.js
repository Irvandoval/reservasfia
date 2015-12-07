'use strict';
angular.module('reservasApp')
  .controller('CicloCtrl', function ($scope, $rootScope, $resource, ngTableParams, toaster, $filter, Ciclo, $modal, Auth) {
   $scope.esAdmin = Auth.isAdmin;
   $rootScope.tablaCiclos = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Ciclo.query().$promise
         .then(function(ciclos){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(ciclos, params.filter()) :
                        ciclos;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });

   $scope.nuevoCiclo = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nuevo-ciclo.html',
      controller: 'NuevoCicloCtrl',
      size: 'lg'
    });
   };

   $scope.editarCiclo = function(ciclo){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-ciclo.html',
      controller: 'EditarCicloCtrl',
      size: 'lg',
      resolve: {
     ciclo: function() {
          return ciclo;
        }
      }
    });
   }
   $scope.eliminarCiclo =  function(id){
    Ciclo.delete({cicloId: id}, function(ciclo){
     $rootScope.tablaCiclos.reload();
       toaster.pop('success', "Ciclo Eliminado", "El ciclo se ha eliminado en el sistema'");
    }, function(err){

    });
   };
  })

  .controller('NuevoCicloCtrl', function($scope, $rootScope,toaster, $modalInstance, Ciclo){
      $scope.enviar =  function(){
        Ciclo.save($scope.ciclo, function(ciclo){
         $rootScope.tablaCiclos.reload();
         $modalInstance.dismiss('cancel');
         toaster.pop('success', "Ciclo Ingresado", "El ciclo se ha ingresado en el sistema'");
        }, function(err){
        });
      }
      $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('EditarCicloCtrl',function(ciclo, $scope, $modalInstance){
    $scope.ciclo = ciclo;
    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  })
