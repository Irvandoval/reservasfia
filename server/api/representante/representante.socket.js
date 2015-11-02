/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Representante = require('./representante.model');

exports.register = function(socket) {
  Representante.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Representante.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('representante:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('representante:remove', doc);
}