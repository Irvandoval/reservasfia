/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Franja = require('./franja.model');

exports.register = function(socket) {
  Franja.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Franja.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('franja:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('franja:remove', doc);
}