'use strict';

angular.module('reservasApp')
  .controller('RepresentanteCtrl', function ($scope, $rootScope, $resource, NgTableParams, $filter, Representante, $modal, toaster, Auth) {
    $scope.esAdmin = Auth.isAdmin;
    $rootScope.tablaRepresentantes= new NgTableParams({
      page: 1, // show first page
      count: 7 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
       Representante.query().$promise
           .then(function(representantes) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(representantes, params.filter()) :
              representantes;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });
$scope.NuevoRepresentante = function() {
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-Representante.html',
        controller: 'NuevoRepresentanteCtrl',
        size: 'lg'
      });
    };

$scope.editarRepresentante= function(representante) {
     $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-representante.html',
        controller: 'EditarRepresentanteCtrl',
        size: 'lg',
        resolve: {
          representante: function() {
            return representante;
          }
        }
      });
    };

$scope.EliminarRepresentante = function(representanteId) {
      Representante.delete({
        representanteId: representanteId
      }, function() {
        $rootScope.tablaRepresentantes.reload();
        toaster.pop('success', 'Representante eliminado', 'El Representante se ha eliminado');
      }, function() {
        toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
      });
    };

  })

.controller('NuevoRepresentanteCtrl', function($scope, $rootScope, $resource, $modalInstance, Representante, toaster) {
  var Escuela = $resource('/api/escuelas');
    Escuela.query(function(escuela){
    $scope.escuelas = escuela;
         });
    var Usuario = $resource('api/users');
        Usuario.query(function(user){
        $scope.users = user;
       });
$scope.NuevoRepresentante = function() {
  Representante.save($scope.representante, function() {
     $rootScope.tablaRepresentantes.reload();
      toaster.pop('success', 'Representante ingresado', 'El Representante se ha ingresado al sistema con exito');
      $modalInstance.dismiss('cancel');
    }, function() {
     toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
    });
};
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})

.controller('EditarRepresentanteCtrl', function(representante, $resource, $scope, $rootScope, $modalInstance, Representante, toaster) {
  $resource('/api/escuelas').query(function(escuelas) {
    $scope.escuelas = escuelas;
  });
  console.log(representante);
  $scope.representantex = {};
  //$scope.usuario = {};
  $scope.representantex = {
    _id: representante._id,
    nombre: representante.nombre,
    escuela: representante.escuela._id,
  };

  $scope.actualizarRepresentante = function() {
    Representante.update({
        representanteId: representante._id
      }, $scope.representantex,
      function() {
        $rootScope.tablaRepresentantes.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', 'Representante actualizado', 'El representante se ha actualizado');
      },
      function() {
        toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
