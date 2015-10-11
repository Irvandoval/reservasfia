/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Turno = require('./turno.model');

exports.register = function(socket) {
  Turno.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Turno.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('turno:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('turno:remove', doc);
}