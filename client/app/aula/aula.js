'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('aula', {
        url: '/aula',
        templateUrl: 'app/aula/aula.html',
        controller: 'AulaCtrl',
	       authenticate: true
      });
  });
