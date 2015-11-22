'use strict';

angular.module('reservasApp')
  .factory('Representante', function ($resource) {
   return $resource('/api/representantes/:representanteId', {representanteId:'@id'},  {
       'update': { method:'PUT' }
   });
  });

