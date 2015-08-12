'use strict';

describe('Controller: CalendarizacionCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var CalendarizacionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalendarizacionCtrl = $controller('CalendarizacionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
