'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schemaOptions = {
      toJSON: {
        virtuals: true
      },
      id: false
    };

var TurnoSchema = new Schema({
   inicio: {type: Date, required: true},
   fin: {type: Date, required: true, validate:[dateValidator,'Fin incorrecto']},
   actividad: {type: Schema.Types.ObjectId, ref: 'Actividad'},
   aulas: [{ type: Schema.Types.ObjectId, ref: 'Aula'}]
}, schemaOptions);


/* validators */
TurnoSchema
.path('inicio')
.validate(function(inicio){
  var self = this;
  var date = new Date();
  date.setHours(6);
  date.setMinutes(19);
  date.setDate(inicio.getDate());
  date.setMonth(inicio.getMonth());
  return date <= inicio;
}, 'Inicio incorrecto');

TurnoSchema
.path('inicio')
.validate(function(inicio){
  var self = this;
  var date = new Date(inicio);
  date.setHours(20);
  date.setMinutes(14);
 // date.setDate(inicio.getDate());
 // date.setMonth(inicio.getMonth());
  return date >= inicio;
}, 'Inicio incorrecto');

TurnoSchema
.path('fin')
.validate(function(fin){
  var self = this;
  var date = new Date(fin);
  date.setHours(20);
  date.setMinutes(15);
 // date.setDate(fin.getDate());
  //date.setMonth(fin.getMonth());
  return fin <= date;
}, 'Fin incorrecto');

/** funcion validar inicio y fin **/
function dateValidator(value){
 return this.inicio < value;
}
/**virtuales**/
TurnoSchema
.virtual('start')
.get(function(){
  return this.inicio;
});

TurnoSchema
.virtual('end')
.get(function(){
  return this.fin;
});

TurnoSchema
.virtual('title')
.get(function(){
 var aulasStr = ' ';
  for(var i = 0; i < this.aulas.length; i++){
   aulasStr = aulasStr + this.aulas[i].nombre + ' ';
  }
  return this.actividad.nombre + '\n' + this.actividad.materia.nombre + '\n' + aulasStr;
});

/** metodos estaticos **/
TurnoSchema.statics.eliminarValoresNull = function(turnos){
 var ret = [];
 for(var i = 0; i < turnos.length; i++ )
  if(turnos[i].actividad !== null && turnos[i].aulas !== null && turnos[i].aulas.length > 0)
       ret.push(turnos[i]);
 return ret;
}

TurnoSchema.statics.filtroValoresNull = function(turno){
  if(turno.actividad !== null && turno.aulas !== null && turno.aulas.length > 0)
       return true;
  return false;
}

module.exports = mongoose.model('Turno', TurnoSchema);
