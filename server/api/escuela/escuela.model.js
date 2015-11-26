'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EscuelaSchema = new Schema({
 nombre: {type:String, required: true, unique: true}
});

module.exports = mongoose.model('Escuela', EscuelaSchema);
