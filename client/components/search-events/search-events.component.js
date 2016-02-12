'use strict';

(function(){
 var SearchEventsComponent = {
   templateUrl: '/components/search-events/search-events.html',
   controller: 'SearchEventsCtrl as se'
 };

 angular.module('reservasApp')
   .component('search', SearchEventsComponent);
}());
