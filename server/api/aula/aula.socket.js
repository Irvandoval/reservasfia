/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Aula = require('./aula.model');

exports.register = function(socket) {
  Aula.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Aula.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('aula:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('aula:remove', doc);
}