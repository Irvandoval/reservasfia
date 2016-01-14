'use strict';
angular.module('reservasApp')
  .controller('CicloCtrl', function($scope, $rootScope, $resource, NgTableParams, toaster, $filter, Ciclo, $modal, Auth) {
    $scope.esAdmin = Auth.isAdmin;
    $rootScope.tablaCiclos = new NgTableParams({
      page: 1, // show first page
      count: 5 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Ciclo.query().$promise
          .then(function(ciclos) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(ciclos, params.filter()) :
              ciclos;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });

    $scope.nuevoCiclo = function() {
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nuevo-ciclo.html',
        controller: 'NuevoCicloCtrl',
        size: 'lg'
      });
    };

    $scope.editarCiclo = function(ciclo) {
      $modal.open({
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
    };
    $scope.eliminarCiclo = function(id) {
      Ciclo.delete({
        cicloId: id
      }, function() {
        $rootScope.tablaCiclos.reload();
        toaster.pop('success', 'Ciclo Eliminado', 'El ciclo se ha eliminado en el sistema');
      }, function(err) {
        console.error(err);
      });
    };
  })

.controller('NuevoCicloCtrl', function($scope, $rootScope, toaster, $modalInstance, Ciclo) {

  $scope.enviar = function(form) {
    $scope.submitted = true;
    console.log(form.$valid);
    if (form.$valid) {
      Ciclo.save($scope.ciclo, function() {
        $rootScope.tablaCiclos.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', 'Ciclo Ingresado', 'El ciclo se ha ingresado en el sistema');
      }, function(err) {
        console.log(err);
        $scope.errors = {};
        //update validity of form fields that match the mongoose errors
        angular.forEach(err.data.errors, function(error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
        });
        toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
      });
    }
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})


.controller('EditarCicloCtrl', function(ciclo, $scope, $rootScope, $modalInstance, Ciclo) {
  $scope.ciclox = {};
  Ciclo.get({
    cicloId: ciclo._id
  }, function(ciclon) {
    console.log(ciclon);
    $scope.ciclox.anio = parseInt(ciclon.anio);
    $scope.ciclox.inicioCiclo = new Date(ciclon.inicioCiclo);
    $scope.ciclox.inicioClases = new Date(ciclon.inicioClases);
    $scope.ciclox.finClases = new Date(ciclon.finClases);
    $scope.ciclox.inicioSubidaHorario = new Date(ciclon.inicioSubidaHorario);
    $scope.ciclox.finSubidaHorario = new Date(ciclon.finSubidaHorario);
    $scope.ciclox.finCiclo = new Date(ciclon.finCiclo);
  });

  $scope.editar = function() {
    Ciclo.update({
      cicloId: ciclo._id
    }, $scope.ciclox, function() {
      $modalInstance.dismiss('cancel');
      $rootScope.tablaCiclos.reload();
    }, function() {
      console.log('err');
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
