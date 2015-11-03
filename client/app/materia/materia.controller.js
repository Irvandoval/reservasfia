'use strict';

angular.module('reservasApp')
  .controller('MateriaCtrl', function ($scope, $resource, ngTableParams, $filter, Materia, $modal) {
      $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Materia.query().$promise
         .then(function(materias){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(materias, params.filter()) :
                        materias;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
  });

    $scope.nuevoMateria = function(){
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'nueva-materia.html',
       controller: 'NuevoMateriaCtrl',
       size: 'lg'
     });
    }

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

.controller('NuevoMateriaCtrl', function(){

  })

  .controller('EditarMateriaCtrl',function(materia, $scope, $modalInstance){
    $scope.materia = materia;
    console.log($scope.materia);
    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  })
