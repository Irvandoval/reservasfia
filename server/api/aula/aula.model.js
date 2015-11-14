'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AulaSchema = new Schema({
  nombre: {type: String, unique: true},// B11, B21, LCOM1
  descripcion: String,
  estado: Boolean,// si esta activo o inactivo
  sonido: Boolean,// si tiene sistema de audio
  pizarra: {},
  capacidad: Number,
  etiquetas: [{type:String, index: true}]//edificio X , Centro de computo, LCOM, Auditorios, Laboratorios UCB... etc etc etc
});

module.exports = mongoose.model('Aula', AulaSchema);
