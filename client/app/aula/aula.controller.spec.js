'use strict';

describe('Controller: AulaCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var AulaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AulaCtrl = $controller('AulaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
