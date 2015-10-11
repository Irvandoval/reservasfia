/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Carrera = require('./carrera.model');

exports.register = function(socket) {
  Carrera.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Carrera.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('carrera:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('carrera:remove', doc);
}