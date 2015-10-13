'use strict';

angular.module('reservasApp')
  .factory('Aula', function ($resource) {
    return $resource('/api/carreras');
  });
