'use strict';

describe('Service: franja', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var franja;
  beforeEach(inject(function (_franja_) {
    franja = _franja_;
  }));

  it('should do something', function () {
    expect(!!franja).toBe(true);
  });

});
