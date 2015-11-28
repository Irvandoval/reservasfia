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
/*Representante.find({}).remove(function(){
   Representante.create({
    nombre: 'Representante Sistemas',
    escuela: '55c2dc510d677df947170280',
    usuario: '5637d2a39e8b466a257b3c5c'
    }
  );
    });
/*Docente.find({}).remove(function(){
   Docente.create({
    nombre: 'Rosario Ortiz',
    escuela: '55c2dc510d677df947170280',
    usuario: "55cd2d6c87d5ad543530fe50",
    materias:['55c2e6fbd9de2ffc4ae4af52','55c2e6fbd9de2ffc4ae4af53']
    },
     {
    nombre: 'Jorge Iraheta',
    escuela: '55c2dc510d677df947170280',
    usuario: "55cd2d6c87d5ad543530fe51",
    materias:['55c2e6fbd9de2ffc4ae4af54','55c2e6fbd9de2ffc4ae4af55']
    }

  );
 });
Escuela.find({}).remove(function(){
   Escuela.create({nombre: "Escuela de Ingenieria de Sistemas informaticos"});
});*/


Materia.find({},function(){
   Materia.create({
    codigo: 'Prueba',
    nombre: 'Prueba',
    tipo: 'obligatoria',
    escuela: '55c2d4e7ae483d4546656964',
   }/*,
   {
    codigo: 'DSI215',
    nombre: 'Diseño de Sistemas II',
    tipo: 'obligatoria',
    escuela: '55c2d4e7ae483d4546656964'
   },
   {
    codigo: 'MIP115',
    nombre: 'Microprogramacion',
    tipo: 'obligatoria',
    escuela: '55c2d4e7ae483d4546656964'
   },
   {
    codigo: 'SIO115',
    nombre: 'Sistemas Operativos',
    tipo: 'obligatoria',
    escuela: '55c2d4e7ae483d4546656964'
   }*/);
});

User.find({},function() {
  User.create({
    provider: 'local',
    role:'invitado',
    name: 'Invitado',
    username: 'invitado',
    password: 'invitado',
  }/*, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    password: 'admin'
  },{
  provider: 'local',
    role: 'docente',
    name: 'Rosario Ortiz',
    username: 'rosario.ortiz',
    password: 'rosario.ortiz'
  },{
  provider: 'local',
    role: 'docente',
    name: 'Jorge Iraheta',
    username: 'jorge.iraheta',
    password: 'jorge.iraheta'
  },{
  provider: 'local',
    role: 'representante',
    name: 'Representante Sistemas',
    username: 'representante_sistemas',
    password: 'representante_sistemas'
  },
  function() {
      console.log('Se ha terminado de llenar usuarios de prueba.');
    }*/
  );
});

/*Actividad.find({}).remove(function(){
  Actividad.create({
    nombre: 'GT01 MAT115 B11',
    tipo: 1,
    encargado:'Ing.Zepeda',
    estado: 'Aprobado',
    fechaCreacion: Date.now()

  });

});
*/
Aula.find({},function(){
    Aula.create({
      nombre: 'Prueba',
      descripcion: 'Aula de prueba, primera planta',
      estado: true,
      sonido: true,
      pizarra: true,
      capacidad: 100,
      etiquetas: ['Edificio B']
    }/*,
    {
      nombre: 'B21',
      descripcion: 'Aula del edificio B, segunda planta',
      estado: true,
      sonido: false,
      pizarra: true,
      capacidad: 100,
      etiquetas: ['Edificio B']
    },
    {
      nombre: 'B31',
      descripcion: 'Aula del edificio B, tercera planta',
      estado: true,
      sonido: false,
      pizarra: true,
      capacidad: 100,
      etiquetas: ['Edificio B']
    },
    {
      nombre: 'B41',
      descripcion: 'Aula del edificio B, cuarta planta',
      estado: true,
      sonido: false,
      pizarra: true,
      capacidad: 60,
      etiquetas: ['Edificio B']
    },

    {
      nombre: 'BIB301',
      descripcion: 'Aula del edificio de la Biblioteca, tercera planta',
      estado: true,
      sonido: false,
      pizarra: true,
      capacidad: 60,
      etiquetas: ['Biblioteca','BIB']
    },

    {
      nombre: 'BIB302',
      descripcion: 'Aula del edificio de la Biblioteca, tercera planta',
      estado: true,
      sonido: false,
      pizarra: true,
      capacidad: 60,
      etiquetas: ['Biblioteca','BIB']
    },

    {
      nombre: 'LCOM1',
      descripcion: 'Centro de computo del edifico de Industrial, primera planta',
      estado: false,
      sonido: false,
      pizarra: true,
      capacidad: 60,
      etiquetas: ['LCOM','Centro de Computo Sistemas']
    },
    {
      nombre: 'LCOM2',
      descripcion: 'Centro de computo del edifico de Industrial, primera planta',
      estado: false,
      sonido: false,
      pizarra: true,
      capacidad: 60,
      etiquetas: ['LCOM','Centro de Computo Sistemas']
    },
    {
      nombre: 'LCOM3',
      descripcion: 'Centro de computo del edifico de Industrial, primera planta',
      estado: false,
      sonido: false,
      pizarra: true,
      capacidad: 24,
      etiquetas: ['LCOM','Centro de Computo Sistemas']
    },
    {
      nombre: 'C11',
      descripcion: 'Aula del edificio C, primera planta',
      estado: true,
      sonido: true,
      pizarra: true,
      capacidad: 100,
      etiquetas: ['Edificio C']
    },
    {
      nombre: 'C21',
      descripcion: 'Aula del edificio C, segunda planta',
      estado: true,
      sonido: true,
      pizarra: true,
      capacidad: 100,
      etiquetas: ['Edificio C']
    },
    function() {
        console.log('Se ha terminado de llenar aulas de prueba.');
      }
    */);
});
