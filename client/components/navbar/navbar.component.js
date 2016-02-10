'use strict';
var NavbarComponent = {
  templateUrl: '/components/navbar/navbar.html',
  controller: 'NavbarCtrl as nv'
};

angular.module('reservasApp')
  .component('navbar', NavbarComponent);
