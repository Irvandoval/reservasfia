'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ciclo', {
        url: '/ciclo',
        templateUrl: 'app/ciclo/ciclo.html',
        controller: 'CicloCtrl as cc',
        authenticate: true
      });
  });
