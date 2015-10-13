'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pensum', {
        url: '/pensum',
        templateUrl: 'app/pensum/pensum.html',
        controller: 'PensumCtrl'
      });
  });