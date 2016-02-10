'use strict';
(function(){
  function MateriaCtrl($rootScope, $resource, NgTableParams, $filter, Materia, $modal, Auth, toaster){
   var self =  this;
   self.editarMateria = editarMateria;
   self.eliminarMateria = eliminarMateria;
   self.esAdmin = Auth.isAdmin;
   self.nuevaMateria  =  nuevaMateria;
   $rootScope.cargarCarreras = cargarCarreras;
   $rootScope.tablaMaterias = new NgTableParams(
    {
      page: 1, // show first page
      count: 50 // count per page
    },
    {
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
   function activate(){
   }
   activate();

   function cargarCarreras(query) {
    var res = $resource('/api/carreras/codigo/' + query);
    return res.query().$promise;
   }

   function editarMateria(materia) {
    $modal.open({
      animation: true,
      templateUrl: '/app/materia/materia-modal.html',
      controller: 'EditarMateriaCtrl as mm',
      size: 'lg',
      resolve: {
        materia: function() {
          return materia;
        }
      }
    });
   }

   function eliminarMateria(materiaId) {
    Materia.delete({
      materiaId: materiaId
    }, function() {
      $rootScope.tablaMaterias.reload();
      toaster.pop('success', 'Materia eliminada', 'La materia se ha eliminado del sistema');
    }, function() {
     // TODO: mensaje de error
    });
  }

   function nuevaMateria() {
    $modal.open({
      animation: true,
      templateUrl: '/app/materia/materia-modal.html',
      controller: 'NuevaMateriaCtrl as mm',
      size: 'lg'
    });
   }
  }

  function NuevaMateriaCtrl($rootScope, $modalInstance, Escuela, Materia, toaster){
    var self =  this;
    self.carrera = {};
    self.cancel = cancel;
    self.escuelas = [];
    self.modoEditar =  false;
    self.nuevaMateria = nuevaMateria;
    self.titulo =  'Nueva Materia';
    function activate(){
     Escuela.query(function(escuelas) {
       self.escuelas = escuelas;
     });
    }
    activate();

    function nuevaMateria(form) {
      self.submitted = true;
      if (form.$valid) {
        Materia.save({
            codigo: self.materia.codigo,
            nombre: self.materia.nombre,
            escuela: self.materia.escuela,
            carreras: obtenerCarreras(),
            tipo: self.materia.tipo,
            imparteEnCiclo: self.materia.imparteEnCiclo
          },
          function() {
            $rootScope.tablaMaterias.reload();
            $modalInstance.dismiss('cancel');
            toaster.pop('success', 'Materia ingresada', 'La materia se ha ingresado al sistema');
            $modalInstance.dismiss('cancel');
          },
          function(err) {
            self.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.data.errors, function(error, field) {
              console.log(form);
              form[field].$setValidity('mongoose', false);
              self.errors[field] = error.message;
            });
            toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
          });
       }
    }

    function obtenerCarreras() {
      var carrerasAux = [];
      for (var i = 0; i < self.materia.carreras.length; i++) {
        carrerasAux.push(self.materia.carreras[i]._id);
      }
      return carrerasAux;
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

  function EditarMateriaCtrl($rootScope, $modalInstance, materia, Materia, toaster){
    var self = this;
    self.cancel = cancel;
    self.materia = {};
    self.modoEditar = true;
    self.editarMateria = editarMateria;
    self.titulo = 'Editar Materia';
    function activate(){
     Materia.get(
      {
       materiaId: materia._id
      },
      function(materiax) {
        self.materia = materiax;
        self.materia.imparteEnCiclo = '' + materiax.imparteEnCiclo;
       }
     );
    }
    activate();

    function editarMateria(form) {
      self.submitted = true;
      if(form.$valid){
       Materia.update({
         materiaId: self.materia._id
       }, {
         codigo: self.materia.codigo,
         nombre: self.materia.nombre,
         tipo: self.materia.tipo,
         imparteEnCiclo: self.materia.imparteEnCiclo,
         carreras: obtenerCarreras()
       }, function() {
         $rootScope.tablaMaterias.reload();
         $modalInstance.dismiss('cancel');
         toaster.pop('success', 'Materia editada', 'La materia se ha editado éxitosamente');
         $modalInstance.dismiss('cancel');
       }, function(err) {
        self.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.data.errors, function(error, field) {
          console.log(form);
          form[field].$setValidity('mongoose', false);
          self.errors[field] = error.message;
        });
         toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar. Por favor intente mas tarde');
       });
      }
    }

   function obtenerCarreras() {
     var carrerasAux = [];
     for (var i = 0; i < self.materia.carreras.length; i++) {
       carrerasAux.push(self.materia.carreras[i]._id);
     }
     return carrerasAux;
   }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

  angular.module('reservasApp')
    .controller('MateriaCtrl', MateriaCtrl)
    .controller('NuevaMateriaCtrl', NuevaMateriaCtrl)
    .controller('EditarMateriaCtrl', EditarMateriaCtrl);
}());
