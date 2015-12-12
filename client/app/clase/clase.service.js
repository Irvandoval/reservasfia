'use strict';

angular.module('reservasApp')
  .factory('ClaseByHorario', function ($resource) {
   return $resource('/api/clases/horario/:horarioId', {HorarioId:'@id'},  {
       'update': { method:'PUT' }
   });
  })

  .factory('Clase', function ($resource) {
   return $resource('/api/clases/:claseId', {claseId:'@id'},  {
       'update': { method:'PUT' }
   });
  });
