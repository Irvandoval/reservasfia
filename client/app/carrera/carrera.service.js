'use strict';

angular.module('reservasApp')
  .factory('Carrera', function ($resource) {
<<<<<<< HEAD
    return $resource('/api/carreras/:carreraId',{carreraid: '@id'},{
        'update':{
            method: 'PUT'
        }
    });
=======
   return $resource('/api/carreras/:carreraId', {carreraId:'@id'},  {
       'update': { method:'PUT' }
   });
>>>>>>> 1b1bbec7f0a80d7794da2baa614e68a323574387
  });
