'use strict';

angular.module('reservasApp')
  .factory('Aula', function ($resource) {
    return $resource('/api/aulas/:aulaId', {aulaId:'@id'},  {
        'update': { method:'PUT' }
    });
  });
