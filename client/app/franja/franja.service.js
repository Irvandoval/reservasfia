'use strict';

angular.module('reservasApp')
  .factory('Franja', function ($resource) {
   return $resource('/api/franjas/:franjaId', {franjaId:'@id'},  {
       'update': { method:'PUT' }
   });
  });
