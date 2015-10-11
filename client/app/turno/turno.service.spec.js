'use strict';

describe('Service: turno', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var turno;
  beforeEach(inject(function (_turno_) {
    turno = _turno_;
  }));

  it('should do something', function () {
    expect(!!turno).toBe(true);
  });

});
