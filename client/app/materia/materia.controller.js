'use strict';

angular.module('reservasApp')

.controller('MateriaCtrl', function($scope, $rootScope, $resource, NgTableParams, $filter, Materia, $modal, Auth, toaster) {
  $scope.esAdmin = Auth.isAdmin;
  $rootScope.tablaMaterias = new NgTableParams({
    page: 1, // show first page
    count: 5 // count per page
  }, {
    total: 0,
    getData: function($defer, params) {
      Materia.query().$promise
        .then(function(materias) {
          var orderedRecentActivity = params.filter() ?
            $filter('filter')(materias, params.filter()) :
            materias;
          params.total(orderedRecentActivity.length);
          $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        });
    }
  });

  $scope.nuevaMateria = function() {
    $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nueva-materia.html',
      controller: 'NuevoMateriaCtrl',
      size: 'lg'
    });
  };

  $scope.eliminarMateria = function(materiaId) {
    Materia.delete({
      materiaId: materiaId
    }, function() {
      $rootScope.tablaMaterias.reload();
      toaster.pop('success', 'Materia eliminada', 'La materia se ha eliminado del sistema');
    }, function() {
      //error
    });
  };

  $scope.editarMateria = function(materia) {
    $modal.open({
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
  };
  $rootScope.cargarCarreras = function(query) {
    var res = $resource('/api/carreras/codigo/' + query);
    return res.query().$promise;
  };
})

.controller('NuevoMateriaCtrl', function($scope, $rootScope, $modalInstance, $resource, Materia, toaster) {
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {
    $scope.escuelas = escuela;
    console.log(escuela);
  });
  $scope.nuevaMateria = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Materia.save({
          codigo: $scope.materia.codigo,
          nombre: $scope.materia.nombre,
          escuela: $scope.materia.escuela,
          carreras: obtenerCarreras(),
          tipo: $scope.materia.tipo,
          imparteEnCiclo: $scope.materia.imparteEnCiclo
        },
        function() {
          $rootScope.tablaMaterias.reload();
          $modalInstance.dismiss('cancel');
          toaster.pop('success', 'Materia ingresada', 'La materia se ha ingresado al sistema');
          $modalInstance.dismiss('cancel');
        },
        function(err) {
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.data.errors, function(error, field) {
            console.log(form);
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
        });
    }
  };

  function obtenerCarreras() {
    var carrerasAux = [];
    for (var i = 0; i < $scope.materia.carreras.length; i++) {
      carrerasAux.push($scope.materia.carreras[i]._id);
    }
    return carrerasAux;
  }
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

})

.controller('EditarMateriaCtrl', function(materia, $rootScope, $scope, $modalInstance, Materia, toaster) {
  Materia.get({
    materiaId: materia._id
  }, function(materiax) {
    $scope.materiaEdit = materiax;
  });

  $scope.editarMateria = function() {
    Materia.update({
      materiaId: $scope.materiaEdit._id
    }, {
      codigo: $scope.materiaEdit.codigo,
      nombre: $scope.materiaEdit.nombre,
      tipo: $scope.materiaEdit.tipo,
      imparteEnCiclo: $scope.materiaEdit.imparteEnCiclo,
      carreras: obtenerCarreras()
    }, function() {
      $rootScope.tablaMaterias.reload();
      $modalInstance.dismiss('cancel');
      toaster.pop('success', 'Materia editada', 'La materia se ha editado éxitosamente');
      $modalInstance.dismiss('cancel');
    }, function() {
      $scope.materiaEdit.carreras = materia.carreras;
      toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  function obtenerCarreras() {
    var carrerasAux = [];
    for (var i = 0; i < $scope.materiaEdit.carreras.length; i++) {
      carrerasAux.push($scope.materiaEdit.carreras[i]._id);
    }
    return carrerasAux;
  }

});
