'use strict';
(function(){
   /**
    * @ngdoc controller
    * @name reservasApp.controller:CicloCtrl
    * @description
    * Este es el controlador principal del CRUD
    * de Ciclos, muestra una tabla con los Ciclos
    * registrados en el sistema.
    */
   function CicloCtrl($rootScope, $resource, NgTableParams, toaster, $filter, Ciclo, $modal, Auth){
      var self = this;
      self.esAdmin =  Auth.isAdmin;
      self.editarCiclo = editarCiclo;
      self.eliminarCiclo = eliminarCiclo;
      self.nuevoCiclo = nuevoCiclo;

      $rootScope.tablaCiclos = new NgTableParams({
      page: 1, // show first page
      count: 5 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        Ciclo.query().$promise
          .then(function(ciclos) {
            var orderedRecentActivity = params.filter() ?
              $filter('filter')(ciclos, params.filter()) :
              ciclos;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });
      function editarCiclo(ciclo) {
        $modal.open({
          animation: true,
          templateUrl: '/app/ciclo/ciclo-modal.html',
          controller: 'EditarCicloCtrl as nc',
          size: 'lg',
          resolve: {
            ciclo: function() {
              return ciclo;
            }
          }
      });
    }

    function eliminarCiclo(id) {
      Ciclo.delete({
        cicloId: id
      }, function() {
        $rootScope.tablaCiclos.reload();
        toaster.pop('success', 'Ciclo Eliminado', 'El ciclo se ha eliminado en el sistema');
      }, function(err) {
        console.error(err);
      });
    }

      function nuevoCiclo() {
        $modal.open({
          animation: true,
          templateUrl: '/app/ciclo/ciclo-modal.html',
          controller: 'NuevoCicloCtrl as nc',
          size: 'lg'
        });
       }
   }

   function NuevoCicloCtrl($rootScope, toaster, $modalInstance, Ciclo){
     var self =  this;
     self.cancel = cancel;
     self.enviar = enviar;
     self.modoEditar = false;
     self.titulo = 'Nuevo Ciclo';

     function enviar(form) {
       self.submitted = true;
       console.log(form.$valid);
       if (form.$valid) {
         Ciclo.save(self.ciclo,
           function() {
             $rootScope.tablaCiclos.reload();
             $modalInstance.dismiss('cancel');
             toaster.pop('success', 'Ciclo Ingresado', 'El ciclo se ha ingresado en el sistema');
           },
            function(err) {
              console.log(err);
              self.errors = {};
              //update validity of form fields that match the mongoose errors
              angular.forEach(err.data.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                self.errors[field] = error.message;
              });
              toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
           });
       }
     }

     function cancel(){
       $modalInstance.dismiss('cancel');
     }
   }

   function EditarCicloCtrl(ciclo, $rootScope, $modalInstance, Ciclo, toaster){
     var self = this;
     self.cancel = cancel;
     self.ciclo = {};
     self.editar = editar;
     self.modoEditar = true;
     self.titulo = 'Editar Ciclo';


     function activate(){
       Ciclo.get({cicloId: ciclo._id},
        function(ciclon) {
          self.ciclo.numero = '' + ciclon.numero;
          self.ciclo.anio = parseInt(ciclon.anio);
          self.ciclo.inicioCiclo = new Date(ciclon.inicioCiclo);
          self.ciclo.inicioClases = new Date(ciclon.inicioClases);
          self.ciclo.finClases = new Date(ciclon.finClases);
          self.ciclo.inicioSubidaHorario = new Date(ciclon.inicioSubidaHorario);
          self.ciclo.finSubidaHorario = new Date(ciclon.finSubidaHorario);
          self.ciclo.finCiclo = new Date(ciclon.finCiclo);
       });
     }
     activate();

     function cancel() {
       $modalInstance.dismiss('cancel');
     }

     function editar() {
       Ciclo.update({
                      cicloId: ciclo._id
                    },
                    self.ciclox,
                    function() {
                      $modalInstance.dismiss('cancel');
                      $rootScope.tablaCiclos.reload();
                      toaster.pop('success', 'Ciclo editado', 'El ciclo se ha editado exitosamente');
                     },
                    function() {
                      console.log('err');
                    }
                   );
     }
   }

   angular.module('reservasApp')
     .controller('CicloCtrl', CicloCtrl)
     .controller('NuevoCicloCtrl', NuevoCicloCtrl)
     .controller('EditarCicloCtrl',EditarCicloCtrl);
}());
