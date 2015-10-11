/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Nivel = require('./nivel.model');

exports.register = function(socket) {
  Nivel.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Nivel.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('nivel:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('nivel:remove', doc);
}