'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('escuela', {
        url: '/escuela',
        templateUrl: 'app/escuela/escuela.html',
        controller: 'EscuelaCtrl as ec',
        authenticate: true
      });
  });
