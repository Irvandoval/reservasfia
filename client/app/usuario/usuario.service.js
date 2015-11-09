'use strict';

angular.module('reservasApp')
.factory('Usuario',function($resource){
   return $resource('/api/users/:userId',{
       userId: '@id'
     }, {
       'update': {
         method: 'PUT'
       }
     });
});
