'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AulaSchema = new Schema({
  nombre: {type: String, required: true, unique: true},// B11, B21, LCOM1
  descripcion: String,
  estado: {type:Boolean,required: true}, // si esta activo o inactivo
  sonido: {type:Boolean, required: true},// si tiene sistema de audio
  pizarra: {},
  capacidad: {type:Number,required: true},
  etiquetas: [{type:String, index: true}]//edificio X , Centro de computo, LCOM, Auditorios, Laboratorios UCB... etc etc etc
});

AulaSchema
.path('nombre')
.validate(function(nombre, respuesta){
 var self =  this;
  this.constructor.findOne({nombre: nombre}, function(err, aula){
   if(err) throw err;
   if(aula){
     if(aula.id === self.id)
       return respuesta(true);
     return respuesta(false);
   }
   return respuesta(true);
  })
}, 'El nombre del aula ya existe');

module.exports = mongoose.model('Aula', AulaSchema);
