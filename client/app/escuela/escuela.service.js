'use strict';

angular.module('reservasApp')
  .factory('Escuela', function ($resource) {
    return $resource('/api/escuelas/:escuelaId', {escuelaId:'@id'},  {
        'update': { method:'PUT' }
    });
  });
