'use strict';

angular.module('reservasApp')
  .factory('Carrera', function ($resource) {
   return $resource('/api/carreras/:carreraId', {carreraId:'@id'},  {
       'update': { method:'PUT' }
   });
  });
