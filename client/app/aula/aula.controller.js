'use strict';

angular.module('reservasApp')
  .controller('AulaCtrl', function($rootScope, $scope, $resource, ngTableParams, $filter, Aula, $modal, toaster, Auth) {
    $scope.esAdmin = Auth.isAdmin;

    $rootScope.tablaAulas = new ngTableParams({
      page: 1, // show first page
      count: 5 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Aula.query().$promise
          .then(function(aulas) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(aulas, params.filter()) :
              aulas;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });

    $scope.nuevaAula = function() {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nueva-aula.html',
        controller: 'NuevaAulaCtrl',
        size: 'lg'
      });
    }


    $scope.eliminarAula = function(idAula) {
      Aula.delete({
        aulaId: idAula
      }, function() {
        $rootScope.tablaAulas.reload();
        toaster.pop('success', "Aula eliminada", "El aula se ha eliminado del sistema'");
      }, function(err) {});
    };

    $scope.editarAula = function(aula) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-aula.html',
        controller: 'EditarAulaCtrl',
        size: 'lg',
        resolve: {
          aula: function() {
            return aula;
          }
        }
      });
    }

  })


.controller('NuevaAulaCtrl', function($scope, $modalInstance, toaster, Aula, $window) {
  $scope.aula = {};
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.enviar = function() {
    Aula.save($scope.aula, function() {
      $scope.tablaAulas.reload();
      $modalInstance.dismiss('cancel');
      toaster.pop('success', "Aula Ingresada", "El aula se ha ingresado en el sistema'");
    }, function() {
      console.log("error");
    })
  }

})

.controller('EditarAulaCtrl', function(aula, $scope, $rootScope, $modalInstance, Aula, toaster) {
 console.log(aula.estado);
  $scope.aula = {
  _id: aula._id,
  nombre: aula.nombre,
  descripcion: aula.descripcion,
  estado: aula.estado,
  capacidad: aula.capacidad,
  sonido: aula.sonido,
  pizarra: aula.pizarra
  };
  console.log($scope.aula);
  $scope.actualizar = function() {
   console.log($scope.aula);
    Aula.update({
      aulaId: $scope.aula._id
    }, $scope.aula, function() {
      $rootScope.tablaAulas.reload();
      $modalInstance.dismiss('cancel');
      toaster.pop('success', "Aula Editada", "El aula se ha editado en el sistema'");
    }, function() {
      console.log("error");
    })
  }
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})
