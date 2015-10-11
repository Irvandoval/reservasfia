'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ayuda', {
        url: '/ayuda',
        templateUrl: 'app/ayuda/ayuda.html',
        controller: 'AyudaCtrl'
      });
  });