'use strict';

describe('Controller: RepresentanteCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var RepresentanteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepresentanteCtrl = $controller('RepresentanteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
