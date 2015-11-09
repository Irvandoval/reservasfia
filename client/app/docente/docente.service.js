'use strict';

angular.module('reservasApp')
  .factory('Docente', function ($resource) {
    return $resource('/api/docentes/:docenteId',{docenteid: '@id'},{
      'update': {
        method: 'PUT'
      }
    });
  });
