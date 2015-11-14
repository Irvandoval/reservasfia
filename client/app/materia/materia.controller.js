'use strict';

angular.module('reservasApp')

.controller('MateriaCtrl', function($scope, $rootScope, $resource, ngTableParams, $filter, Materia, $modal, Auth, toaster) {
  $scope.esAdmin = Auth.isAdmin;


  $rootScope.tablaMaterias = new ngTableParams({
    page: 1, // show first page
    count: 5 // count per page
  }, {
    total: 0,
    getData: function($defer, params) {
      Materia.query().$promise
        .then(function(materias) {
          console.log(materias);
          var orderedRecentActivity = params.filter() ?
            $filter('filter')(materias, params.filter()) :
            materias;
          params.total(orderedRecentActivity.length);
          $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        })

    }
  });

  $scope.nuevaMateria = function() {
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nueva-materia.html',
      controller: 'NuevoMateriaCtrl',
      size: 'lg'
    });
  }

  $scope.eliminarMateria = function(materiaId) {
    Materia.delete({
      materiaId: materiaId
    }, function() {
      $rootScope.tablaMaterias.reload();
      toaster.pop('success', "Materia eliminada", "La materia se ha eliminado del sistema");
    }, function(err) {});
  };

  $scope.editarMateria = function(materia) {
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-materia.html',
      controller: 'EditarMateriaCtrl',
      size: 'lg',
      resolve: {
        materia: function() {
          return materia;
        }
      }
    });
  }


})

.controller('NuevoMateriaCtrl', function($scope, $rootScope, $modalInstance, $resource, Materia, toaster) {
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {

    $scope.escuelas = escuela;
    console.log(escuela);
  });
  $scope.nuevaMateria = function() {
    Materia.save($scope.materia, function(materia) {
     $rootScope.tablaMaterias.reload();
      toaster.pop('success', "Materia ingresada", "La materia se ha ingresado al sistema");
      $modalInstance.dismiss('cancel');
    }, function(err) {
      toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
    });

  }
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

})

.controller('EditarMateriaCtrl', function(materia, $rootScope, $scope, $modalInstance, Materia, toaster) {
  $scope.materiaEdit = {
    _id: materia._id,
    codigo: materia.codigo,
    nombre: materia.nombre,
    tipo: materia.tipo,
    imparteEnCiclo: materia.imparteEnCiclo
  };

  $scope.editarMateria = function() {
    Materia.update({
      materiaId: $scope.materiaEdit._id
    }, $scope.materiaEdit, function(materia) {
     $rootScope.tablaMaterias.reload();
      toaster.pop('success', "Materia editada", "La materia se ha editado éxitosamente");
      $modalInstance.dismiss('cancel');
    }, function(err) {
      toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
    })
  }
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


})
