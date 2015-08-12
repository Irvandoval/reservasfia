'use strict';

describe('Service: actividad', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var actividad;
  beforeEach(inject(function (_actividad_) {
    actividad = _actividad_;
  }));

  it('should do something', function () {
    expect(!!actividad).toBe(true);
  });

});
