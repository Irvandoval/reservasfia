'use strict';

angular.module('reservasApp')
  .factory('Representante', function ($resource) {
   return $resource('/api/representantes/:repId', {repId:'@id'},  {
       'update': { method:'PUT' }
   });
  });

