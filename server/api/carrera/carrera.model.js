'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarreraSchema = new Schema({
  codigo: {type: String, required: true, unique: true},
  nombre: {type: String, required: true, unique: true},
  plan: {type: Number, required: true},
  escuela: {type: Schema.Types.ObjectId, ref: 'Escuela', required: true}
});

CarreraSchema
.path('codigo')
.validate(function(codigo, respuesta){
  var self =  this;
  this.constructor.findOne({codigo: codigo}, function(err, carrera){
   console.log(carrera);
   if(err) throw err;
   if(carrera){
    if(carrera.id === self.id)
      return respuesta(true);
    return respuesta(false);
   }
   return respuesta(true);
  });
}, 'El código de carrera ya existe');

CarreraSchema
.path('codigo')
.validate(function(codigo){
 return /([A-Z]){1}\d{5}$/.test(codigo);
}, 'Código inválido');

CarreraSchema
.path('nombre')
.validate(function(nombre){
 return /([a-z ñáéíóú]{2,60})$/i.test(nombre);
}, 'Nombre Inválido');

module.exports = mongoose.model('Carrera', CarreraSchema);
