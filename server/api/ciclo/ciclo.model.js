'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CicloSchema = new Schema({
   numero: Number, // 1 o 2
   anio: Number,
   inicioClases: Date,
   finClases: Date,
   inicioCiclo: Date,
   finCiclo: Date,
   inicioSubidaHorario: Date,
   finSubidaHorario: Date,

});

module.exports = mongoose.model('Ciclo', CicloSchema);
