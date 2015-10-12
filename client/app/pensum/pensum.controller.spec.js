'use strict';

describe('Controller: PensumCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var PensumCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PensumCtrl = $controller('PensumCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
