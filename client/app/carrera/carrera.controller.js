'use strict';

angular.module('reservasApp')
  .controller('CarreraCtrl', function($rootScope, $scope, $resource, ngTableParams, $filter, Carrera, $modal, Auth, toaster) {
    $scope.esAdmin = Auth.isAdmin;
    $rootScope.tablaCarreras = new ngTableParams({
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
          })

      }
    });
    $scope.nuevaCarrera = function() {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nueva-carrera.html',
        controller: 'NuevaCarreraCtrl',
        size: 'lg'
      });
    }
    $scope.editarCarrera = function(carrera) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-carrera.html',
        controller: 'EditarCarreraCtrl',
        size: 'lg',
        resolve: {
          carrera: function() {
            return carrera;
          }
        }
      });
    }

    $scope.eliminarCarrera =  function(id){
     Carrera.delete({carreraId: id}, function(){
        $rootScope.tablaCarreras.reload();
         toaster.pop('success', "Carrera eliminada", "La carrera se ha eliminado al sistema");

     }, function(){
 toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");``
     })
    }
  })

.controller('NuevaCarreraCtrl', function($scope, $rootScope, toaster, $resource, $modalInstance, Carrera) {
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {
    $scope.escuelas = escuela;
  });
  $scope.nuevaCarrera = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Carrera.save($scope.carrera, function(carrera) {

       $rootScope.tablaCarreras.reload();
       $modalInstance.dismiss('cancel');
        toaster.pop('success', "Carrera ingresada", "La carrera se ha agregado al sistema");
      }, function(err) {
        $rootScope.tablaCarreras.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
    }
  }
  $scope.cancel = function() {
   $rootScope.tablaCarreras.reload();
    $modalInstance.dismiss('cancel');
  };

})

.controller('EditarCarreraCtrl', function($rootScope, carrera, $scope, $modalInstance,$resource,toaster, Carrera) {
  Carrera.get({carreraId: carrera._id}, function(carrera){
   $scope.carrerax =  carrera;
  })
  var Escuela = $resource('/api/escuelas');
  Escuela.query(function(escuela) {
    $scope.escuelas = escuela;
  });
  $scope.editar =  function(){
   Carrera.update({carreraId: carrera._id}, $scope.carrerax, function(carrera){
   $rootScope.tablaCarreras.reload();
    $modalInstance.dismiss('cancel');
     toaster.pop('success', "Carrera editada", "La carrera se ha editado exitosamente");
   }, function(err){
       $rootScope.tablaCarreras.reload();
      $modalInstance.dismiss('cancel');
    toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
   });

  }


  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})
