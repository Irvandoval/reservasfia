'use strict'

angular.module('reservasApp')
 .factory('Ciclo', function ($resource){
   return $resource('/api/ciclos');
 });
