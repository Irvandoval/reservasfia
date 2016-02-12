'use strict';
(function () {
 function EventsFactory() {
   var events = [];
   var factory =  {
     add: add,
     get:  get,
     removeAll: removeAll
   };

   return factory;

   function add(event){
     events.push(event);
   }

   function get(){
     return events;
   }

   function removeAll(){
     events.splice(0, events.length);
   }
 }

 angular.module('reservasApp')
   .factory('Events', EventsFactory);
}());
