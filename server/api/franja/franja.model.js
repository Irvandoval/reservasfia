'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FranjaSchema = new Schema({
   franja: {type: String,  required: false},
   horaInicio: {type: Number, required: true},
   minutoInicio: {type: Number, required: true},
   horaFinal: {type: Number,required: true},
   minutoFinal: {type: Number, required: true}
});

module.exports = mongoose.model('Franja', FranjaSchema);
