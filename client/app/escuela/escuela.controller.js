'use strict';

angular.module('reservasApp')
  .controller('EscuelaCtrl', function ($rootScope, $scope, $resource, ngTableParams, $filter, Escuela, $modal, toaster, Auth) {
   $scope.esAdmin = Auth.isAdmin;

   $rootScope.tablaEscuelas = new ngTableParams({
     page: 1, // show first page
     count: 5 // count per page
   }, {
     total: 0,
     getData: function($defer, params) {
       Escuela.query().$promise
         .then(function(escuelas) {
           var orderedRecentActivity = params.filter() ?
             $filter('filter')(escuelas, params.filter()) :
             escuelas;
           params.total(orderedRecentActivity.length);
           $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

     }
   });

   $scope.nuevaEscuela = function() {
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'nueva-escuela.html',
       controller: 'NuevaEscuelaCtrl',
       size: 'lg'
     });
   }


   $scope.eliminarEscuela = function(id) {
     Escuela.delete({
       escuelaId: id
     }, function() {
       $rootScope.tablaEscuelas.reload();
       toaster.pop('success', "Escuela eliminada", "La escuela se ha eliminado del sistema");
     }, function(err) {});
   };

   $scope.editarEscuela = function(escuela) {
     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'editar-escuela.html',
       controller: 'EditarEscuelaCtrl',
       size: 'lg',
       resolve: {
         escuela: function() {
           return escuela;
         }
       }
     });
   }

 })

  .controller('NuevaEscuelaCtrl', function($scope, $rootScope, $modalInstance, toaster, Escuela, $window, $resource ) {
    
    $scope.escuela = {};
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.enviar = function(form) {
        $scope.submitted= true;
        if (form.$valid) {
      Escuela.save($scope.escuela, function() {
        $rootScope.tablaEscuelas.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', "Escuela ingresada", "La escuela se ha ingresado en el sistema");
      }, function(err) {
        $scope.errors={};
          //Update validity of form fields that match the mongoose errors
          angular.forEach(err.data.errors, function(error, field){
              form[field].setValidity('mongoose',false);
              $scope.errors[field]=error.message;
          });
          toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
              
      }
    }

  })



  .controller('EditarEscuelaCtrl', function(escuela, Escuela, $scope, $rootScope, $modalInstance, toaster) {

    $scope.escuela = {
      _id: escuela._id,
      name: escuela.name
    };
    console.log($scope.escuela);
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.actualizar = function() {
      console.log($scope.escuela);
      Escuela.update({
        escuelaId: escuela._id
      }, $scope.escuela, function() {
        $rootScope.tablaEscuelas.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', "Escuela editada", "La escuela se ha editado");
      }, function() {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      })
    };
  })
