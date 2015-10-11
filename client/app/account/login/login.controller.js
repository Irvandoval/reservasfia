'use strict';

angular.module('reservasApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          username: $scope.user.username,
          password: $scope.user.password
        })
        .then( function() {
          // Logueado, redirigido a la home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
    
    $scope.invitado =  function(){
      Auth.login({
          username: 'invitado',
          password: 'invitado'
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
    }

  });
