'use strict';

angular.module('reservasApp')
  .controller('DocenteCtrl', function($scope, $rootScope, $resource, ngTableParams, $filter, Docente, $modal, toaster, Auth) {
    $scope.esAdmin = Auth.isAdmin;
    $rootScope.tablaDocentes = new ngTableParams({
      page: 1, // show first page
      count: 7 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Docente.query().$promise
          .then(function(docentes) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(docentes, params.filter()) :
              docentes;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });
    $scope.nuevoDocente = function() {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-docente.html',
        controller: 'NuevoDocenteCtrl',
        size: 'lg'
      });
    }

    $scope.editarDocente = function(docente) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-docente.html',
        controller: 'EditarDocenteCtrl',
        size: 'lg',
        resolve: {
          docente: function() {
            return docente;
          }
        }
      });
    }

    $scope.eliminarDocente = function(id) {
      Docente.delete({
        docenteId: id
      }, function() {
        $rootScope.tablaDocentes.reload();
        toaster.pop('success', "Docente eliminado", "El docente se ha eliminado");
      }, function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
    }
    $rootScope.cargarMaterias = function(query) {
      var res = $resource('/api/materias/nombre/' + query);
      return res.query().$promise
    };



  })

.controller('NuevoDocenteCtrl', function($scope, $rootScope, $resource, $modalInstance, Docente, toaster) {
  $scope.docente = {};
  $resource('/api/escuelas').query(function(escuelas) {
    $scope.escuelas = escuelas;
  });
  $scope.nuevoDocente = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      $scope.docente.materias = obtenerMaterias();
      Docente.save($scope.docente, function() {
        $rootScope.tablaDocentes.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', "Docente creado", "El docente se ha creado");
      }, function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
    }

  }
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  function obtenerMaterias() {
    var materiasAux = [];
    for (var i = 0; i < $scope.docente.materias.length; i++) {
      materiasAux.push($scope.docente.materias[i]._id);
    }
    return materiasAux;
  }
})

.controller('EditarDocenteCtrl', function(docente, $resource, $scope, $rootScope, $modalInstance, Docente, toaster, Auth) {
  $resource('/api/escuelas').query(function(escuelas) {
    $scope.escuelas = escuelas;
  });
  $scope.docentex = {};
  $scope.usuario = {};
  $scope.docentex = {
    _id: docente._id,
    nombre: docente.nombre,
    escuela: docente.escuela._id,
    materias: docente.materias,
    usuario: docente.usuario
  };

  $scope.actualizarDocente = function() {
    $scope.docentex.materias = obtenerMaterias();
    Docente.update({
        docenteId: docente._id
      }, $scope.docentex,
      function(docente) {
        $rootScope.tablaDocentes.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', "Docente actualizado", "El docente se ha actualizado");
      },
      function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      })
  };
  $scope.createUsuario = function() {
    $scope.usuario.role = 'docente';
    $scope.usuario.name = docente.nombre;
    Auth.createUser($scope.usuario)
      .then(function(user) {
       console.log(user);
        Docente.update({
          docenteId: docente._id
        }, {
          usuario: user._id
        }, function() {
          $rootScope.tablaDocentes.reload();
          $modalInstance.dismiss('cancel');
          toaster.pop('success', "Creado usuario", "Se ha creado un usuario para el docente éxitosamente");
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

  function obtenerMaterias() {
    var materiasAux = [];
    for (var i = 0; i < $scope.docentex.materias.length; i++) {
      materiasAux.push($scope.docentex.materias[i]._id);
    }
    return materiasAux;
  }
})
