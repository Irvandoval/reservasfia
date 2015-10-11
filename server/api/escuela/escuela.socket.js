/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Escuela = require('./escuela.model');

exports.register = function(socket) {
  Escuela.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Escuela.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('escuela:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('escuela:remove', doc);
}