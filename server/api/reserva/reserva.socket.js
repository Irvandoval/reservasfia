/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Reserva = require('./reserva.model');

exports.register = function(socket) {
  Reserva.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Reserva.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('reserva:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('reserva:remove', doc);
}