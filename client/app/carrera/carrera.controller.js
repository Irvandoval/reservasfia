

'use strict';

angular.module('reservasApp')
  .controller('CarreraCtrl', function ($scope, $resource, ngTableParams, $filter, Carrera, $modal, Auth) {
   $scope.esAdmin = Auth.isAdmin;
   $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 5          // count per page
     }, {
         total:0,
         getData: function ($defer, params) {
         Carrera.query().$promise
         .then(function(carreras){
          var orderedRecentActivity = params.filter() ?
                        $filter('filter')(carreras, params.filter()) :
                        carreras;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
   $scope.nuevaCarrera = function(){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'nueva-carrera.html',
      controller: 'NuevaCarreraCtrl',
      size: 'lg'
    });
   }
   $scope.editarCarrera = function(carrera){
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editar-carrera.html',
      controller: 'EditarCarreraCtrl',
      size: 'lg',
      resolve: {
        aula: function() {
          return carrera;
        }
      }
    });
   }
  })

  .controller('NuevaCarreraCtrl', function($scope, $rootScope,toaster, $resource, $modalInstance, Carrera){
   var Escuela = $resource('/api/escuelas');
   Escuela.query(function(escuela) {

     $scope.escuelas = escuela;
     console.log(escuela);
   });
   $scope.nuevaCarrera = function(form) {
    $scope.submitted = true;
    if(form.$valid){
     Carrera.save($scope.carrera, function(carrera){
       toaster.pop('success', "Carrera ingresada", "La carrera se ha agregado al sistema");
     },function(err){
       toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
     });
    }
   }

  })

  .controller('EditarCarreraCtrl',function(carrera, $scope, $modalInstance){
    $scope.carrera = carrera;
    console.log($scope.carrera);

    $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  })
