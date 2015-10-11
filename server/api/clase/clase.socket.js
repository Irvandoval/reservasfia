/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Clase = require('./clase.model');

exports.register = function(socket) {
  Clase.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Clase.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('clase:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('clase:remove', doc);
}