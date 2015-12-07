/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var User = require('../api/user/user.model');
var Aula = require('../api/aula/aula.model');
var Escuela = require('../api/escuela/escuela.model');
var Actividad = require('../api/actividad/actividad.model');
var Materia = require('../api/materia/materia.model');
var Docente = require('../api/docente/docente.model');
var Ciclo = require('../api/ciclo/ciclo.model');
var Representante = require('../api/representante/representante.model');

var Horario = require('../api/horario/horario.model');
var Clase =  require('../api/clase/clase.model');
var Franja =  require('../api/franja/franja.model');

Clase.find({}).remove(function(){
Clase.create({
 tipo: 'GT',
 numero: 2,
 cupo: 100,
 dia1: 1,
 dia2: 3,
 franja1: "565cd41cff75b7fe2a602d12",
 franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af47",
 materia: "563fa64c3bcf29b61d70d7b1",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GD',
 numero: 1,
 cupo: 100,
 dia1: 1,
 //dia2: 'miercoles',
 franja1: "565cd41cff75b7fe2a602d12",
 //franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af47",
 materia: "55c2e6fbd9de2ffc4ae4af55",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "55cd6ea6d53897eb56e12806",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GT',
 numero: 1,
 cupo: 100,
 dia1: 2,
 dia2: 5,
 franja1: "565cd41cff75b7fe2a602d12",
 franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af49",
 materia: "563fa64c3bcf29b61d70d7b1",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GL',
 numero: 1,
 cupo: 100,
 dia1: 1,
 //dia2: 'miercoles',
 franja1: "565cd41cff75b7fe2a602d12",
// franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af49",
 materia: "563fa64c3bcf29b61d70d7b1",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GT',
 numero: 1,
 cupo: 100,
 dia1: 1,
 dia2: 3,
 franja1: "565cd41cff75b7fe2a602d12",
 franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af4c",
 materia: "563f9b64252439fa13e70632",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GD',
 numero: 1,
 cupo: 100,
 dia1: 2,
 //dia2: 'miercoles',
 franja1: "565cd41cff75b7fe2a602d12",
// aula: "55c2e6fbd9de2ffc4ae4af4c",
 materia: "563f9b64252439fa13e70632",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
},
{
 tipo: 'GL',
 numero: 2,
 cupo: 100,
 dia1: 1,
 //dia2: 'miercoles',
 franja1: "565cd41cff75b7fe2a602d12",
 //franja2: "565cd41cff75b7fe2a602d12",
 aula: "55c2e6fbd9de2ffc4ae4af47",
 materia: "563fa64c3bcf29b61d70d7b1",
 ciclo:  "565c88d8c6d684ed0dd81dc3",
 docente: "565cd74a3db1ab1e2c6b81b1",
 horario: "565cce9a672f8e4a290865e5"
}


)
});
