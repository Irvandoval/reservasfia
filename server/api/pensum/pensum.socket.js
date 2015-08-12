/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pensum = require('./pensum.model');

exports.register = function(socket) {
  Pensum.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pensum.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pensum:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pensum:remove', doc);
}