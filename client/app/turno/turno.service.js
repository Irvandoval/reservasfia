'use strict';

angular.module('reservasApp')
  .factory('Turno', function ($resource) {
   return $resource('/api/turnos/:idTurno',{idTurno: '@id'},
		    {'update': { method:'PUT' }}
  );
  });
