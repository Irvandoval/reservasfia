/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Horario = require('./horario.model');

exports.register = function(socket) {
  Horario.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Horario.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('horario:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('horario:remove', doc);
}