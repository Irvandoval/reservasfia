'use strict';

var express = require('express');
var controller = require('./horario.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
var multer  = require('multer');
var done = false;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'horario' + '-' + Date.now() + '.xlsx');
  }
});
var upload = multer({storage: storage});


router.get('/', controller.index);
router.post('/xlsjson',upload.single('excel'),controller.xlstojson);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'),auth.hasRole('representante'),controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
