'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EscuelaSchema = new Schema({
 nombre: String
});

module.exports = mongoose.model('Escuela', EscuelaSchema);
