'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('representante', {
        url: '/representante',
        templateUrl: 'app/representante/representante.html',
<<<<<<< HEAD
        controller: 'RepresentanteCtrl',
        authenticate: true
      });
  });
=======
        controller: 'RepresentanteCtrl'
      });
  });
>>>>>>> 5309244487f9efeaa1d505142cb2abdc83acbd39
