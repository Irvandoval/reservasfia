'use strict';

var express = require('express');
var controller = require('./docente.controller');
var cascade = require('../../components/cascade/docente.cascade');
var router = express.Router();

router.get('/', controller.index);
router.get('/materia/:id', controller.indexByMaterias);
router.get('/user/:id',controller.byuser);
router.get('/nombre/:nombre', controller.regexNombreByMateria);
router.get('/escuela/:id',controller.byEscuela);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', cascade.docente(), controller.destroy);

module.exports = router;
