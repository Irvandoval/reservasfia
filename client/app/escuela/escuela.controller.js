'use strict';
(function(){
/**
 * @ngdoc controller
 * @name reservasApp.controller:EscuelaCtrl
 * @description
 * Este es el controlador principal del CRUD de escuelas
 * muestra una tabla con las escuelas registradas en la
 * DB del sistema con la opcion de poder crear una nueva,
 * editar y/o eliminar una existente.
 */
 function EscuelaCtrl($rootScope, $resource, NgTableParams, $filter, Escuela, $modal, toaster, Auth) {
    var self =  this;
    self.esAdmin = Auth.isAdmin;
    self.nuevaEscuela = nuevaEscuela;
    self.eliminarEscuela = eliminarEscuela;
    self.editarEscuela = editarEscuela;
   ////////////////////////////
   function activate(){
    $rootScope.tablaEscuelas = new NgTableParams({
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
          });
      }
    });
   }
   activate();
   ////////////////////////////
   function editarEscuela(escuela) {
     $modal.open({
       animation: true,
       templateUrl: '/app/escuela/editar-escuela.html',
       controller: 'EditarEscuelaCtrl as ee',
       size: 'lg',
       resolve: {
         escuela: function() {
           return escuela;
         }
       }
     });
   }

   function eliminarEscuela(id) {
     Escuela.delete({
       escuelaId: id
     }, function() {
       $rootScope.tablaEscuelas.reload();
       toaster.pop('success', 'Escuela eliminada', 'La escuela se ha eliminado del sistema');
     }, function() {// error
     });
   }

   function nuevaEscuela() {
      $modal.open({
       animation: true,
       templateUrl: '/app/escuela/nueva-escuela.html',
       controller: 'NuevaEscuelaCtrl as ne',
       size: 'lg'
     });
   }
  }

 /**
 * @ngdoc controller
 * @name reservasApp.controller:NuevaEscuelaCtrl
 * @description
 * Controlador encargado de crear una nueva escuela y
 * gestionar los mensajes de exito o de error
 */
  function NuevaEscuelaCtrl($rootScope, $modalInstance, toaster, Escuela ) {
   var self = this;
   self.cancel = cancel;
   self.enviar = enviar;
   self.escuela = {};
   ////////////////////////////
   function cancel() {
     $modalInstance.dismiss('cancel');
   }

   function enviar(form) {
     self.submitted = true;
     if (form.$valid) {
       Escuela.save(self.escuela, function() {
         $rootScope.tablaEscuelas.reload();
         $modalInstance.dismiss('cancel');
         toaster.pop('success', 'Escuela ingresada', 'La escuela se ha ingresado en el sistema');
       }, function(err) {
         self.errors = {};
         angular.forEach(err.data.errors, function(error, field) {
           form[field].setValidity('mongoose', false);
           self.errors[field] = error.message;
         });
         toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
       });
     }
   }

}
/**
 * @ngdoc controller
 * @name reservasApp.controller: EditarEscuelaCtrl
 * @description
 * Este controlador se encarga de editar una escuela y
 * gestionar el mensaje de error o exito
 */
  function EditarEscuelaCtrl(escuela, Escuela, $rootScope, $modalInstance, toaster) {
   var self = this;
   self.escuela = {
     _id: escuela._id,
     nombre: escuela.nombre
   };
   self.cancel = function() {
     $modalInstance.dismiss('cancel');
   };

   self.actualizar = function(form) {
    self.submitted =  true;
    if(form.$valid){
       Escuela.update({
         escuelaId: escuela._id
       }, self.escuela, function() {
         $rootScope.tablaEscuelas.reload();
         $modalInstance.dismiss('cancel');
         toaster.pop('success', 'Escuela editada', 'La escuela se ha editado');
       }, function() {
           toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
       });
    }
   };
 }

 angular
    .module('reservasApp')
    .controller('EscuelaCtrl', EscuelaCtrl)
    .controller('NuevaEscuelaCtrl', NuevaEscuelaCtrl)
    .controller('EditarEscuelaCtrl', EditarEscuelaCtrl);

})();
