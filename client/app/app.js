'use strict';
angular.module('reservasApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'angular-confirm',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'ui.calendar',
    'ngTagsInput',
    'ngTable',
    'ngFileUpload',
    'angular-momentjs',
    'toaster'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  };
})

.run(function($rootScope, $location, Auth, $state, $stateParams, $timeout, $confirmModalDefaults) {
  $confirmModalDefaults.defaultLabels.title = 'Confirmar Acción';
  $confirmModalDefaults.defaultLabels.ok = 'Si';
  $confirmModalDefaults.defaultLabels.cancel = 'No';
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function(event, next, toState, toStateParams) {
    $rootScope.toState = toState;
    $rootScope.toStateParams = toStateParams;
    // $rootScope.progressbar = ngProgressFactory.createInstance();
    // $rootScope.progressbar.setColor("#E4F0F6");
    //   $rootScope.progressbar.start();
    /*$timeout(function(){
         $rootScope.progressbar.complete();
    },600);*/
    Auth.isLoggedInAsync(function(loggedIn) {
      if (next.authenticate && !loggedIn) {
        $location.path('/login');
      }
    });
  });
});
