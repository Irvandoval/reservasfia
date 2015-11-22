'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FranjaSchema = new Schema({
   franja: String,
   horaInicio: Number,
   minutoInicio: Number,
   horaFinal: Number,
   minutoFinal: Number
});

module.exports = mongoose.model('Franja', FranjaSchema);
