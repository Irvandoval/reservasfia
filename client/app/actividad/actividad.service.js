'use strict';

angular.module('reservasApp')
  .factory('Actividad', function ($resource) {
   return $resource('/api/actividades');
  });
