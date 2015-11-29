'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CicloSchema = new Schema({
   numero: Number, // 1 o 2
   anio: {type: Number, required: true},
   inicioClases: {type: Date,required: true, unique: true},
   finClases: {type: Date, required: true, unique: true},
   inicioCiclo: {type: Date, required: true, unique: true},
   finCiclo: {type: Date, required: true, unique: true},
   inicioSubidaHorario: {type: Date, required: true, unique: true},
   finSubidaHorario: {type: Date, required: true, unique: true},

});

module.exports = mongoose.model('Ciclo', CicloSchema);
