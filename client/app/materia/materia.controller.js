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
  $rootScope.cargarCarreras = function(query) {
    var res = $resource('/api/carreras/codigo/' + query);
    return res.query().$promise
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
    console.log(form.$valid);
     if(form.$valid){
      $scope.materia.carreras = obtenerCarreras();
       Materia.save($scope.materia, function(materia) {
        $rootScope.tablaMaterias.reload();
        $modalInstance.dismiss('cancel');
         toaster.pop('success', "Materia ingresada", "La materia se ha ingresado al sistema");
         $modalInstance.dismiss('cancel');
       }, function(err) {
        $scope.materia.carreras = undefined;
        $scope.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.data.errors, function(error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
        });
         toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
       });
     }


  }
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
Materia.get({materiaId: materia._id}, function(materiax){
 $scope.materiaEdit = materiax;
});

  $scope.editarMateria = function() {
   $scope.materiaEdit.carreras = obtenerCarreras();
    Materia.update({
      materiaId: $scope.materiaEdit._id
    }, $scope.materiaEdit, function(materiax) {
     $rootScope.tablaMaterias.reload();
     $modalInstance.dismiss('cancel');
      toaster.pop('success', "Materia editada", "La materia se ha editado éxitosamente");
      $modalInstance.dismiss('cancel');
    }, function(err) {
      $scope.materiaEdit.carreras =  materia.carreras;
      toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
    })
  }
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

})
