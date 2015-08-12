/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Materia = require('./materia.model');

exports.register = function(socket) {
  Materia.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Materia.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('materia:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('materia:remove', doc);
}