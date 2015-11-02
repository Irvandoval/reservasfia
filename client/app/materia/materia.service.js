'use strict';

angular.module('reservasApp')
  .factory('Materia', function ($resource) {
    return $resource('/api/materias');
  });
