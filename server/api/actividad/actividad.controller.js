'use strict';
var moment = require('moment');
var _ = require('lodash');
var Actividad = require('./actividad.model');
var Representante = require('../representante/representante.model');
var Reserva = require('../reserva/reserva.model');
var Turno = require('../turno/turno.model')


// Obtiene Lista de todas las actividades
exports.index = function(req, res) {
  Actividad
    .find()
    .populate('materia')
    .populate('creadoPor')
    .exec(function(err, docs) {
      if (err) {
        return handleError(res, err);
      }
      Actividad.populate(docs, {
        path: 'turnos.aulas',
        model: 'Aula',
        select: 'nombre'
      }, function(err, actividades) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(actividades);
      });
    });
};

//obtiene todas actividades aprobadas
exports.indexAprobados = function(req, res) {
  Actividad
    .find({
      estado: 'aprobado'
    })
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};

//Obtiene todas las actividades aprobadas donde el encargado sea un usuario
exports.indexMisAprobados = function(req, res) {
  console.log(req.user);
  Actividad
    .find({
      estado: 'aprobado',
      encargado: req.user.name
    })
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};
//Obtiene las actividades desaprobadas por el admin
exports.indexDesaprobados = function(req, res) {
  Actividad
    .find({
      estado: 'desaprobado'
    })
    // .populate('turnos')
    // .populate('aulas')
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};

// obtiene las actividades desaprobadas ya sean por la escuela o por el admin
exports.indexMisDesaprobados = function(req, res) {
  console.log(req.user);
  Actividad
    .find({
      $and: [{
        $or: [{
          estado: 'desaprobado'
        }, {
          estado: 'desaprobado_escuela'
        }]
      }, {
        encargado: req.user.name
      }]
    })
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};

// obtiene todas las reservas que estan en espera para el administrador (aprobados por la escuela)
exports.indexEspera = function(req, res) {
  Actividad
    .find({
      estado: 'espera_admin'
    })
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};

/*exports.indexEsperaEscuelaA = function(req, res) {
  Representante
    .findOne({
      usuario: req.user._id
    }, function(err, representante) {
      console.log(req.user._id);
      Actividad
        .find({
          estado: 'espera_escuela',
          escuela: representante.escuela
        }, function(err, actividades) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(actividades);
        })

    })
};*/
// obtiene todas las reservas que son parte de una escuela y estan en espera
exports.indexEsperaEscuelaB = function(req, res) {
  Representante
    .findOne({
      usuario: req.user._id
    }, function(err, representante) {
      console.log("rep");
      console.log(representante);
      Actividad
        .find({
          estado: 'espera_escuela',
          escuela: representante.escuela
        })
        .populate('materia', 'nombre')
        .exec(function(err, actividades) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(actividades);
        });
    })
};

//Obtiene las reservas que han sido desaprobadas por x escuela
exports.indexDesaprobadosByEscuela = function(req, res) {
  Representante
    .findOne({
      usuario: req.user._id
    }, function(err, representante) {
      Actividad
        .find({
          estado: 'desaprobado_escuela',
          escuela: representante.escuela
        })
        .populate('materia', 'nombre')
        .exec(function(err, actividades) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(actividades);
        });

    })
};
// obtiene las actividades que han sido aprobadas por x escuela que actualmente estan en los estados del admin
exports.indexByEscuela = function(req, res) {
  Representante
    .findOne({
      usuario: req.user._id
    }, function(err, representante) {
      Actividad
        .find({
          $and: [{
            $or: [{
              estado: 'espera_admin'
            }, {
              estado: 'aprobado'
            }, {
              estado: 'desaprobado'
            }]
          }, {
            escuela: representante.escuela
          }]
        })
        .populate('materia', 'nombre')
        .exec(function(err, actividades) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(actividades);
        });

    })
};

// obtiene las actividades que estan en espera (en escuela o en administracion) y pertenecen a x usuario
exports.indexMisEspera = function(req, res) {
  console.log(req.user);
  Actividad
    .find({
      $or: [{
        estado: 'espera_escuela'
      }, {
        estado: 'espera_admin'
      }],
      encargado: req.user.name
    })
    .populate('materia', 'nombre')
    .exec(function(err, actividades) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividades);
    });
};

//Renderiza HTML de un comprobante  de una actividad
exports.comprobante = function(req, res) {
    console.log(req.params.id);
    Actividad
      .findById(req.params.id)
      .populate('materia')
      .populate('escuela')
      .populate('creadoPor')
      .exec(function(err, actividad) {
       if (err) {
         return handleError(res, err);
       }
       if(actividad.estado === 'aprobado'){
        Turno.find({
            actividad: req.params.id
          })
          .populate('aulas')
          .exec(function(err, turnos) {
            if (err) {
              return handleError(res, err);
            }
            res.render('comprobante', {
              title: 'ejs',
              actividad: actividad,
              turnos: turnos,
              moment: moment
            });

          });
       }else{
          return handleError(res, 'Error, la actividad no esta aprobada');
       }
      });


  }
  // Get a single actividad
exports.show = function(req, res) {

  Actividad
    .findById(req.params.id)
    .populate('materia', 'nombre')
    .exec(function(err, actividad) {
      if (err) {
        return handleError(res, err);
      }
      if (!actividad) {
        return res.status(404).send('Not Found');
      }
      return res.json(actividad);
    });
};

// Creates a new actividad in the DB.
exports.create = function(req, res) {
  req.body.actividad.fechaCreacion = Date.now();
  Actividad.create(req.body.actividad, function(err, actividad) {
    var opts = {
      path: 'materia',
      select: 'nombre'
    };
    Actividad.populate(actividad, opts, function(err, actividadPop) {
      if (err) {
        return handleError(res, err);
      }
      var nuevaActividad = new Actividad(actividadPop);
      nuevaActividad.crearTurnos(req.body.turnos,function(err) {
       if (err) { return handleError(res, err);}
        return res.status(201).json(actividadPop);
      });
    })

  });
};

// Updates an existing actividad in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Actividad.findById(req.params.id, function(err, actividad) {
    if (err) {
      return handleError(res, err);
    }
    if (!actividad) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(actividad, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(actividad);
    });
  });
};

// Deletes a actividad from the DB.
exports.destroy = function(req, res) {

  Reserva.find({
    actividad: req.params.id
  }).remove(function() {
    Turno.find({
      actividad: req.params.id
    }).remove(function() {
      Actividad.findById(req.params.id, function(err, actividad) {
        if (err) {
          return handleError(res, err);
        }
        if (!actividad) {
          return res.status(404).send('Not Found');
        }
        actividad.remove(function(err) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(204).send('No Content');
        });
      });

    })
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
