'use strict';

var express = require('express');
var controller = require('./docente.controller');
var cascade = require('../../components/cascade/docente.cascade');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/materia/:id', auth.isAuthenticated(), controller.indexByMaterias);
router.get('/user/:id', auth.isAuthenticated(), controller.byuser);
router.get('/nombre/:nombre',  auth.isAuthenticated(), controller.regexNombreByMateria);
router.get('/escuela/:id',  auth.isAuthenticated(), controller.byEscuela);
router.get('/:id',  auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), cascade.docente(), controller.destroy);

module.exports = router;
