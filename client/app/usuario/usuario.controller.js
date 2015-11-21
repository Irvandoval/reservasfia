'use strict';

angular.module('reservasApp')
  .controller('UsuarioCtrl', function($scope, $rootScope, ngTableParams, $filter, Usuario, $modal, toaster) {


    $rootScope.tablaUsuarios = new ngTableParams({
      page: 1, // show first page
      count: 7 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Usuario.query().$promise
          .then(function(usuarios) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(usuarios, params.filter()) :
              usuarios;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });

    $scope.nuevoUsuario = function() {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-usuario.html',
        controller: 'NuevoUsuarioCtrl',
        size: 'lg'
      });
    }

    $scope.editarUsuario = function(usuario) {
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

     $scope.eliminarUsuario = function(id){
       Usuario.delete({userId: id}, function(){
          $rootScope.tablaUsuarios.reload();
         toaster.pop('success', "Usuario eliminado", "El usuario se ha eliminado");
       }, function(){
          toaster.pop('error', "Error", "Ha ocurrido un error al eliminar. Por favor intente mas tarde");
       });
     }

  })

.controller('NuevoUsuarioCtrl', function($scope, $rootScope, $resource, $modalInstance, Auth, Docente, Representante, toaster) {
  $scope.usuario = {};
  $scope.user = {};
  $resource('/api/escuelas').query(function(escuelas) {
    $scope.escuelas = escuelas;
  });
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.crearUsuario = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Auth.createUser($scope.user)
        .then(function(usuariox) {
          // creamos docente o representante
          if ($scope.user.role == 'docente') {
            $scope.usuario.materias = obtenerMaterias();
            $scope.usuario.nombre = $scope.user.name;
            $scope.usuario.usuario = usuariox._id;
            Docente.save($scope.usuario, function(usuario) {
              $rootScope.tablaUsuarios.reload();
              $modalInstance.dismiss('cancel');
              toaster.pop('success', "Docente creado", "El docente se ha creado'");
            }, function(err) {
              toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
            });
          }
          if ($scope.user.role == 'representante') {
            $scope.usuario.nombre = $scope.user.name;
            $scope.usuario.usuario = usuariox._id;
            Representante.save($scope.usuario, function(usuario) {
              $rootScope.tablaUsuarios.reload();
              $modalInstance.dismiss('cancel');
              toaster.pop('success', "Representante creado", "El usuario se ha creado'");
            }, function(err) {
              toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
            });
          }

          $rootScope.tablaUsuarios.reload();
          $modalInstance.dismiss('cancel');
          toaster.pop('success', "Usuario creado", "El usuario se ha creado'");
        })
        .catch(function(err) {
          err = err.data;
          $scope.errors = {};
          console.log(err);
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });

    }
  }
  $scope.cargarMaterias = function(query) {
    var res = $resource('/api/materias/nombre/' + query);
    return res.query().$promise
  };

  function obtenerMaterias() {
    var materiasAux = [];
    for (var i = 0; i < $scope.usuario.materias.length; i++) {
      materiasAux.push($scope.usuario.materias[i]._id);
    }
    return materiasAux;
  }
})

.controller('EditarUsuarioCtrl', function(usuario, Usuario, $scope, $rootScope, $modalInstance, toaster) {

  $scope.usuario = {
    _id: usuario._id,
    name: usuario.name,
    username: usuario.username
  };
  console.log($scope.usuario);
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.actualizar = function() {
    console.log($scope.usuario);
    Usuario.update({
      userId: usuario._id
    }, $scope.usuario, function() {
      $rootScope.tablaUsuarios.reload();
      $modalInstance.dismiss('cancel');
      toaster.pop('success', "Usuario editado", "El usuario se ha editado");
    }, function() {
      toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
    })
  };
})
