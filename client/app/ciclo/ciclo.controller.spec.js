'use strict';

describe('Controller: CicloCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var CicloCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CicloCtrl = $controller('CicloCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
