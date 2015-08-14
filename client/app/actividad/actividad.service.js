'use strict';

angular.module('reservasApp')
  .factory('Actividad', function ($resource) {
   return $resource('/api/actividades/:idActividad',{idActividad: '@id'},
		    { 'update': { method:'PUT' }}
  );
  });
