'use strict';

angular.module('reservasApp')
  .controller('CarreraCtrl', function($rootScope, $scope, $resource, NgTableParams, $filter, Carrera, $modal, Auth, toaster) {
    $scope.esAdmin = Auth.isAdmin;
    $rootScope.tablaCarreras = new NgTableParams({
      page: 1, // show first page
      count: 5 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Carrera.query().$promise
          .then(function(carreras) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(carreras, params.filter()) :
              carreras;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });
    $scope.nuevaCarrera = function() {
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/app/carrera/carrera-modal.html',
        controller: 'NuevaCarreraCtrl',
        size: 'lg'
      });
    };
    $scope.editarCarrera = function(carrera) {
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/app/carrera/carrera-modal.html',
        controller: 'EditarCarreraCtrl',
        size: 'lg',
        resolve: {
          carrera: function() {
            return carrera;
          }
        }
      });
    };

    $scope.eliminarCarrera = function(id) {
      Carrera.delete({
        carreraId: id
      },
      function() {
        $rootScope.tablaCarreras.reload();
        toaster.pop('success', 'Carrera eliminada', 'La carrera se ha eliminado al sistema');

      },
      function() {
        toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
      });
    };
  })

.controller('NuevaCarreraCtrl', function($scope, $rootScope, toaster, $resource, $modalInstance, Carrera) {
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {
    $scope.escuelas = escuela;
  });
  $scope.tipo = 1;
  $scope.encabezado = 'Nueva Carrera';
  $scope.nuevaCarrera = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Carrera.save($scope.carrera,
        function() {
          $rootScope.tablaCarreras.reload();
          $modalInstance.dismiss('cancel');
          toaster.pop('success', 'Carrera ingresada', 'La carrera se ha agregado al sistema');
        },
        function(err) {
          console.log(err);
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.data.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
        });
    }
  };

  $scope.cancel = function() {
    $rootScope.tablaCarreras.reload();
    $modalInstance.dismiss('cancel');
  };

})

.controller('EditarCarreraCtrl', function($rootScope, carrera, $scope, $modalInstance, $resource, toaster, Carrera) {
  Carrera.get({
    carreraId: carrera._id
  }, function(carrera) {
    $scope.carrera = carrera;
  });
  $scope.encabezado = 'Editar Carrera';
  $scope.tipo = 2;
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {
    $scope.escuelas = escuela;
  });

  $scope.editar = function() {
    Carrera.update({
        carreraId: carrera._id
      }, $scope.carrera,
      function() {
        $rootScope.tablaCarreras.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', 'Carrera editada', 'La carrera se ha editado exitosamente');
      },
      function(err) {
        $rootScope.tablaCarreras.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
        console.error(err);
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

})
