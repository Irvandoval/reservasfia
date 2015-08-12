/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Docente = require('./docente.model');

exports.register = function(socket) {
  Docente.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Docente.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('docente:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('docente:remove', doc);
}