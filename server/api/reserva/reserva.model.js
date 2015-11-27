'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schemaOptions = {
  toJSON: {
    virtuals: true
  },
  id: false
};

var ReservaSchema = new Schema({
   aula: { type: Schema.Types.ObjectId, ref: 'Aula' },
   inicio: Date,
   fin: Date,
   actividad: { type: Schema.Types.ObjectId, ref: 'Actividad', required: false}
}, schemaOptions);

/**
 * Virtuales

ReservaSchema
.virtual('start')
.get(function(){
  return this.inicio;
});

ReservaSchema
.virtual('end')
.get(function(){
  return this.fin;
});

ReservaSchema
.virtual('title')
.get(function(){
  return this.actividad.nombre + ' ' + this.aula.nombre;
});*/

/**
 *  Metodos
 */

ReservaSchema.methods = {
 /**
  *detectarChoque - Detecta si existe un choque con la reserva que se desea ingresar
  *@param {Object} Reserva
  *@return {Object} el objeto Reserva que choca.
  */
  detectarChoque: function(callback){
    var query = {
      $and: [{$or:[ { $and: [ { inicio:{ $lte: this.fin } }, { inicio:{ $gte: this.inicio } } ] },
		    { $and: [ { fin:{ $gte: this.inicio } }, { fin:{ $lte: this.fin } } ] },
		    { $and: [ { fin:{ $gte: this.fin } }, { inicio:{ $lte: this.inicio }  }]}]},
	     {aula:this.aula}]
    };
    this.constructor.findOne(query, function(err,reserva){
      callback(err,reserva)
    }
    );
  }
}

module.exports = mongoose.model('Reserva', ReservaSchema);
