'use strict';

(function(){
 function SearchEventsCtrl($rootScope, Escuela, $resource, Events, uiCalendarConfig){
   var self = this;
   var materiasEvt = [];
   var aulasEvt = [];
   self.aulas = [];
   self.busquedaPorAulas = busquedaPorAulas;
   self.busquedaPorMaterias  = busquedaPorMaterias;
   self.cargarAulas = cargarAulas;
   self.cargarMaterias = cargarMaterias;
   self.escuela = '';
   self.materias = [];
   self.seleccionarTipoBusqueda = seleccionarTipoBusqueda;
   self.porAulaEvtAprobado = {
     url: '/api/turnos/aulas',
     className: 'aprobado',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.aulas.length; m++) {
         aulasEvt[m] = self.aulas[m].nombre;
       }
       return {
         _aulas: aulasEvt,
         estado: 'aprobado'
       };
     }
   };
   self.porAulaEvtEsperaAdmin = {
     url: '/api/turnos/aulas',
     className: 'espera',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.aulas.length; m++) {
         aulasEvt[m] = self.aulas[m].nombre;
       }
       return {
         _aulas: aulasEvt,
         estado: 'espera_admin'
       };
     }
   };
   self.porAulaEvtEsperaEscuela = {
     url: '/api/turnos/aulas',
     className: 'esperaEscuela',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.aulas.length; m++) {
         aulasEvt[m] = self.aulas[m].nombre;
       }
       return {
         _aulas: aulasEvt,
         estado: 'espera_escuela'
       };
     }
   };
   self.porMateriaEsperaEvt = {
     url: '/api/turnos/materias',
     className: 'espera',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.materias.length; m++) {
         materiasEvt[m] = self.materias[m]._id;
       }
       console.log(materiasEvt);
       return {
         _materias: materiasEvt,
         estado: 'espera_admin'
       };
     }
   };
   self.porMateriaEsperaEscuelaEvt = {
     url: '/api/turnos/materias',
     className: 'esperaEscuela',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.materias.length; m++) {
         materiasEvt[m] = self.materias[m]._id;
       }
       console.log(materiasEvt);
       return {
         _materias: materiasEvt,
         estado: 'espera_escuela'
       };
     }
   };
   self.porMateriaAprobadaEvt = {
     url: '/api/turnos/materias',
     className: 'aprobado',
     startParam: 'inicio',
     endParam: 'fin',
     data: function() {
       for (var m = 0; m < self.materias.length; m++) {
         materiasEvt[m] = self.materias[m]._id;
       }
       console.log(materiasEvt);
       return {
         _materias: materiasEvt,
         estado: 'aprobado'
       };
     }
   };

   function activate(){
     Escuela.query(function(escuelas){
       self.escuelas = escuelas;
     });
     self.radio1 = false;
     self.radio2 = false;
   }
   activate();

   function cargarAulas(query) {
     var res = $resource('/api/aulas/nombre/' + query);
     return res.query().$promise;
   }

   function cargarMaterias(query) {
     var res = $resource('/api/materias/nombre/' + query);
     return res.query().$promise;
   }

   function busquedaPorMaterias(){
     if(self.materias.length){
      Events.removeAll();
      Events.add(self.porMateriaEsperaEvt);
      Events.add(self.porMateriaEsperaEscuelaEvt);
      Events.add(self.porMateriaAprobadaEvt);
      uiCalendarConfig.calendars.calendario.fullCalendar('refetchEvents');
     }
   }

   function busquedaPorAulas(){
     if(self.aulas.length){
       Events.removeAll();
       Events.add(self.porAulaEvtEsperaAdmin);
       Events.add(self.porAulaEvtEsperaEscuela);
       Events.add(self.porAulaEvtAprobado);
       uiCalendarConfig.calendars.calendario.fullCalendar('refetchEvents');
     }
   }

   function seleccionarTipoBusqueda(tipo){
     if(tipo === 1){
       self.radio1 = true;
       self.radio2 = false;
     }else{
      self.radio2 = true;
      self.radio1 = false;
     }
   }
 }

 angular.module('reservasApp')
   .controller('SearchEventsCtrl', SearchEventsCtrl);
}());
