'use strict';

angular.module('reservasApp')
  .controller('RepresentanteCtrl', function ($scope, $rootScope, $resource, ngTableParams, $filter, Representante, $modal, toaster, Auth) {
    $scope.esAdmin = Auth.isAdmin;
    
    $rootScope.tablaRepresentantes= new ngTableParams({
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
          })

      }
    });
$scope.NuevoRepresentante = function() {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-Representante.html',
        controller: 'NuevoRepresentanteCtrl',
        size: 'lg'
      });
    }

$scope.EditarRepresentante= function(representante) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-representante.html',
        controller: 'EditarRepresentanteCtrl',
        size: 'lg',
        resolve: {
          representante: function() {
            return Representante;
          }
        }
      });
    }

$scope.EliminarRepresentante = function(representanteId) {
      Representante.delete({
        representanteId: representanteId
      }, function() {
        $rootScope.tablaRepresentantes.reload();
        toaster.pop('success', "Representante eliminado", "El Representante se ha eliminado");
      }, function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
    }

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
  Representante.save($scope.representante, function(representante) {
     $rootScope.tablaRepresentantes.reload();
      toaster.pop('success', "Representante ingresado", "El Representante se ha ingresado al sistema con exito");
      $modalInstance.dismiss('cancel');
    }, function(err) {
     toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
    });
}
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})

.controller('EditarRepresentanteCtrl', function(representante, $resource, $scope, $rootScope, $modalInstance, Representante, toaster, Auth) {
  $resource('/api/escuelas').query(function(escuelas) {
    $scope.escuelas = escuelas;
  });
  $scope.representantex = {};
  $scope.usuario = {};
  $scope.representantex = {
    _id: representante._id,
    nombre: representante.nombre,
    escuela: representante.escuela._id,
    usuario: representante.usuario
  };

  $scope.actualizarRepresentante = function() {
   Representante.update({
        representanteId: representante._id
      }, $scope.representantex,
      function(representante) {
        $rootScope.tablaRepresentante.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', "Representate actualizado", "El representante se ha actualizado");
      },
      function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      })
  };
  $scope.createUsuario = function() {
    $scope.usuario.role = 'representante';
    $scope.usuario.name = representante.nombre;
    Auth.createUser($scope.usuario)
      .then(function(user) {
       console.log(user);
        Representante.update({
          docenteId: representante._id
        }, {
          usuario: user._id
        }, function() {
          $rootScope.tablaRepresentante.reload();
          $modalInstance.dismiss('cancel');
          toaster.pop('success', "Creado usuario", "Se ha creado un usuario para el Representante éxitosamente");
        }, function() {
          toaster.pop('error', "Error", "Ha ocurrido un error actualizar docente. Por favor intente mas tarde");
        })
      })
      .catch(function(err) {
        toaster.pop('error', "Error", "Ha ocurrido un error al crear usuario. Por favor intente mas tarde");
      });

  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

 
})