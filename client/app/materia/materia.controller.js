'use strict';

angular.module('reservasApp')

  .controller('MateriaCtrl', function ($scope, $resource, ngTableParams, $filter, Materia, $modal,Auth, toaster) {
   $scope.esAdmin = Auth.isAdmin;


      $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Materia.query().$promise
         .then(function(materias){
          console.log(materias);
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(materias, params.filter()) :
                        materias;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
  });

    $scope.nuevaMateria = function(){
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'nueva-materia.html',
       controller: 'NuevoMateriaCtrl',
       size: 'lg'
     });
    }

$scope.eliminarMateria= function(materiaId){
Materia.delete({materiaId:materiaId},function(){
       $scope.tableParams.reload();
       toaster.pop('success', "materia eliminada", "la materia se ha eliminado del sistema'");
     },function(err){});
  };

  $scope.editarMateria = function(materia){
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

.controller('NuevoMateriaCtrl', function($scope, $modalInstance){

    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  })

  .controller('EditarMateriaCtrl',function(materia, $scope, $modalInstance){
    $scope.materia = materia;
    console.log($scope.materia);
    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


  })
