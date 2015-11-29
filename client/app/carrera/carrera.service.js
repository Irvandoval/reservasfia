'use strict';

angular.module('reservasApp')
  .factory('Carrera', function ($resource) {
    return $resource('/api/carreras/:carreraId',{carreraid: '@id'},{
        'update':{
            method: 'PUT'
        }
    });
  });
