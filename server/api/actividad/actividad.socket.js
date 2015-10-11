/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Actividad = require('./actividad.model');

exports.register = function(socket) {
  Actividad.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Actividad.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('actividad:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('actividad:remove', doc);
}