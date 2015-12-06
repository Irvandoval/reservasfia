'use strict';

angular.module('reservasApp')
  .controller('CalendarizacionCtrl', function(Auth, $scope, $resource, toaster, $compile, $modal, $log, uiCalendarConfig, $rootScope) {
    var DIAS_HABILES = 3; // Dias anteriores al dia que se quiere reservar
    var H_MIN = 6;
    var M_MIN = 20;
    var H_MAX = 8;
    var M_MAX = 15;
    var dm = new Date();
    $scope.cicloActual = $rootScope.cicloActual;
    dm.setHours(H_MIN);
    dm.setMinutes(M_MIN);
    $scope.hMin = dm;
    var dm = new Date();
    dm.setHours(6);
    dm.setMinutes(20);
    $scope.hMin = dm;

     var errorDB = false;
     $scope.solicitud = {};
    /******************************Calendario******************************/
    /*Variables*/
    $scope.busqueda = {};
    var aulasEvt = [];
    $scope.aprobadosEvt = { //  carga los eventos del dia actual en el web service.
      url: '/api/turnos/estado/aprobados',
      className: 'aprobado',
      startParam: 'inicio',
      endParam: 'fin'
    };
    $scope.esperaEvt = { //  carga los eventos del dia actual en el web service.
      url: '/api/turnos/estado/espera',
      className: 'espera',
      startParam: 'inicio',
      endParam: 'fin'
    };
    $scope.esperaEscuelaEvt = { //  carga los eventos del dia actual en el web service.
      url: '/api/turnos/estado/espera_escuela',
      className: 'esperaEscuela',
      startParam: 'inicio',
      endParam: 'fin'
    };
    $scope.porAulaEvt = {
      url: '/api/turnos/aulas',
      className: 'espera',
      startParam: 'inicio',
      endParam: 'fin',
      data: function() {
        for (var m = 0; m < $scope.aulas.length; m++) {
          aulasEvt[m] = $scope.aulas[m].nombre;
        }
        return {
          _aulas: aulasEvt
        };
      }
    }

    $scope.esAdmin = Auth.isAdmin;
    $scope.esDocente = Auth.isDocente;
    $scope.esRepresentante = Auth.isRepresentante;

    /*Funciones*/
    // evento al dar clic a una reserva
    $scope.alertOnEventClick = function(date, jsEvent, view) {
      console.log(date);
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'reserva-detalle.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          actividad: function() {
            return date;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.porAulas = function() {
      // console.log("opcion: " + $scope.busqueda.opcion2);
      if ($scope.busqueda.opcion2 == true) {
        $scope.eventSources.splice(0, $scope.eventSources.length); //eliminamos las actuales resources de eventos
        $scope.eventSources.push($scope.porAulaEvt);
      } else {
        if ($scope.busqueda.opcion2 == false) {
          $scope.eventSources.splice(0, $scope.eventSources.length);
          $scope.aulas.splice(0, $scope.aulas.length);
          $scope.eventSources.push($scope.aprobadosEvt);
          $scope.eventSources.push($scope.esperaEvt);
          aulasEvt.splice(0, aulasEvt.length);
        }
      }
    }
    $scope.filtroPorAulas = function() {
        //console.log($scope.eventSources.length);
        aulasEvt.splice(0, aulasEvt.length);
        // $scope.eventSources.splice(0,$scope.eventSources.length);
        //
        //console.log($scope.eventSources);

        uiCalendarConfig.calendars['calendario'].fullCalendar('refetchEvents');
      }
      /*$scope.addRemoveEventSource = function(sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function(value, key) {
          if (sources[key] === source) {
            sources.splice(key, 1);
            canAdd = 1;
          }
        });
        if (canAdd === 0) {
          sources.push(source);
        }
      };

      $scope.addEvent = function(dia) {
        console.log("entra");
        $scope.events.events.push({
          title: 'Prueba',
          start:  new Date(2015, 08, 08, 6, 20, 0),
        end: new Date(2011, 08, 08, 8, 0, 0)
          className: ['Clases']
        });
      };
      /* remove event
      $scope.remove = function(index) {
        $scope.events.splice(index, 1);
      };
      /* Change View */
    $scope.changeView = function(view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
    /* Render Tooltip */
    $scope.eventRender = function(event, element, view) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };

    $scope.uiConfig = {
      calendar: {
        editable: false, // no se podra arrastrar ni extender
        height: 500,
        ignoreTimezone: false, // usara el UTC -6
        timezone: 'local',
        header: {
          left: 'month,agendaWeek,agendaDay', // vistas de mes semana y dia
          center: 'title',
          right: 'today prev,next'
        },
        buttonText: {
          today: 'hoy',
          month: 'mes',
          week: 'semana',
          day: 'día'
        },
        eventClick: $scope.alertOnEventClick,
        eventRender: $scope.eventRender,
        defaultView: 'agendaDay',
        allDaySlot: false,
        firstDay: 1,
        lang: 'es',
        firstHour: 8,
        slotMinutes: 20,
        defaultEventMinutes: 120,
        timeFormat: 'HH:mm',
        axisFormat: 'HH:mm',
        minTime: "06:00:00",
        maxTime: "21:00:00",
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesShort: ["dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      }
    };

    $scope.items = ['item1', 'item2', 'item3'];
    /**********************************************************************/
    $scope.esDocente = Auth.isDocente;

    /***********************************************************************/
    $scope.actividad = { // inicializamos la actividad para la reserva
      inicio: new Date(2011, 2, 12, 6, 20, 0),
      fin: new Date(2011, 2, 12, 8, 0, 0)
    };
    $scope.hstep = 1; // horas en el timepicker se desplaza 1 hora
    $scope.mstep = 5; // minutos en el timepicker se desplaza 5 mins
    $scope.ismeridian = false; // no mostrara AM/PM
    $scope.changed = function() { // evento al cambiar la hora en el timepicker de inicio
      $scope.actividad.fin = $scope.actividad.inicio;
    };
    $scope.irvan = function() {
      $scope.mostrar = true;
      if (Auth.isDocente()) {
        var usuario = Auth.getCurrentUser();
        $resource('/api/docentes/user/:idUser', {
            idEscuela: '@id'
          }).get({
            idUser: usuario._id
          }, function(docente) {
           $scope.actividad.docente = docente._id;
           $scope.materias = docente.materias;
           $scope.actividad.escuela = docente.escuela;
          });

       /* var docente = Docente.get({
          docenteId: usuario._id
        }, function() {
          console.log(docente);
          $scope.materias = docente.materias;
          $scope.actividad.escuela = docente.escuela;
        });*/
      }
      if (Auth.isAdmin()) {
        $resource('/api/escuelas').query().$promise
          .then(function(escuelas) {
            $scope.escuelas = escuelas;
          });
      }

      if (Auth.isRepresentante()) {
        var Representante = $resource('/api/representantes/user/:representanteId', {
          representanteId: '@id'
        });
        var usuario = Auth.getCurrentUser();
        var representante = Representante.get({
          representanteId: usuario._id
        }, function() {
          $scope.actividad.escuela = representante.escuela._id;
          // $scope.rellenarMaterias(representante.escuela);
          var docentesPorEscuela = $resource('/api/docentes/escuela/:escuelaId', {
            escuelaId: '@id'
          });

          var docentes = docentesPorEscuela.query({
            escuelaId: representante.escuela._id
          }, function() {
            //console.log(docente);
            $scope.docentes = docentes;
          });
        });
      }
    }
    $scope.datePicker = {};
    var hoy = new Date();
    $scope.minDate = new Date(hoy);
    $scope.minDate.setDate(hoy.getDate() + DIAS_HABILES);
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.datePicker.opened = true;
    };

    /************************************************************************/

    /* event sources array*/
    $scope.eventSources = [$scope.aprobadosEvt, $scope.esperaEvt, $scope.esperaEscuelaEvt];
    $scope.animationsEnabled = true;

    /**************************************************************************/
    $scope.etiquetas = ['Edificio B', 'Edificio C', 'Edificio D']; // parametros de busqueda para reservas
    $scope.aulas = []; // parametro de busqueda por aulas

    $scope.loadTags = function(query) {
      return ['Edificio Electrica', 'Laboratorios UCB', 'Auditorios', 'Edificio Industrial', 'LCOMP', 'BIB', 'Edificio Mecanica'];
    };
    $scope.cargarAulas = function(query) {
      var res = $resource('/api/aulas/nombre/' + query);
      return res.query().$promise
    };
    /****************************************************************************/
    $scope.rellenarDocentes = function() {
     console.log($scope.actividad.escuela);
      $resource('/api/docentes/escuela/:idEscuela', {
          idEscuela: '@id'
        })
        .query({
          idEscuela: $scope.actividad.escuela
        }, function(docentes) {
          $scope.docentes = docentes;
        });
    }
    $scope.rellenarMaterias = function() {
//console.log($scope.actividad.docente);
      $resource('/api/docentes/:idDocente', {
          idDocente: '@id'
        })
        .get({
          idDocente: $scope.actividad.docente
        }, function(docente) {
          $scope.materias = docente.materias;
         // console.log(docente);
        });
    }

    $scope.enviar = function(form) {
      $scope.submitted = true;
   //   console.log(form.$valid) ;
      if (form.$valid || errorDB) {
        var fecha = new Date($scope.actividad.fecha);
        var fechaHi = new Date($scope.actividad.inicio);
        var fechaFi = new Date($scope.actividad.fin);
        var encargado;
        var aulas;
        var nuevaActividad = {};
        var dates = { // objeto con la fecha y horas de la actividad
          dia: fecha.getDate(),
          mes: fecha.getMonth(),
          year: fecha.getFullYear(),
          mi: fechaHi.getMinutes(),
          hi: fechaHi.getHours(),
          mf: fechaFi.getMinutes(),
          hf: fechaFi.getHours()
        };
        var DetectaChoque = $resource('/api/reservas/choque/detectarChoque', {});
        var reservasComprobar = crearReservas(dates); // creamos reservas 'auxiliares' para detectar posibles choques.
        var estado;
        if ($scope.solicitud.enviarAdmin == true){
         estado = 'espera_admin';
        }else{
         estado = 'espera_escuela'
        }
        DetectaChoque.save(reservasComprobar).$promise //mandamos las reservas al WS para comprobar choque
          .then(function(data) {
            encargado = $scope.actividad.docente // el encargado estara definido en un campo especial
            nuevaActividad = {
              nombre: $scope.actividad.nombre,
              tipo: 2, //esto deberia cambiar en un futuro para soportar otro tipo de actividades
              encargado: encargado,
              estado: estado,
              creadoPor: Auth.getCurrentUser()._id,
              materia: $scope.actividad.materia,
              escuela: $scope.actividad.escuela,
              ciclo: $scope.cicloActual._id
            };
            aulas = obtenerAulas();
            console.log(dates);
            var nuevoTurno = { // se crea el turno para la actividad (solo se soporta 1 turno en esta version)
              inicio: new Date(dates.year, dates.mes, dates.dia, dates.hi, dates.mi),
              fin: new Date(dates.year, dates.mes, dates.dia, dates.hf, dates.mf),
              aulas: aulas
            };
            var actEnviar = {
              actividad: nuevaActividad,
              turnos: [nuevoTurno]
            }
          //  console.log(actEnviar);
            $resource('/api/actividades')
              .save(actEnviar).$promise
              .then(function(actividadCreada) {
                uiCalendarConfig.calendars['calendario'].fullCalendar('refetchEvents');
                toaster.pop('success', "Éxito", "La reserva se ha enviado a aprobación");
                $scope.actividad = {};
                $scope.actividad.inicio = nuevoTurno.inicio;
                $scope.actividad.fin =  nuevoTurno.fin;
                $scope.submitted = false;
                 form.fin.$error.mongoose = false;
                 form.inicio.$error.mongoose = false;
                errorDB =  false;
                $scope.irvan();
              }, function(err) {
                $scope.errors = {};
               console.log(err.data.errors);
               // Update validity of form fields that match the mongoose errors
               angular.forEach(err.data.errors, function(error, field) {
                 form[field].$setValidity('mongoose', false);
                 $scope.errors[field] = error.message;
               });
                errorDB = true;
               toaster.pop('error', "Error", "Ha ocurrido un error al enviar");
              });
          }, function(err) {
            toaster.pop('error', "Error", "Se ha detectado choque de horarios");
          });
      }
    };

    function crearReservas(f) {
      var reservas = {};
      reservas.data = [];
      var nuevaReserva = {};
      for (var i = 0; i < $scope.actividad.aulas.length; i++) {
        nuevaReserva = {
          inicio: new Date(f.year, f.mes, f.dia, f.hi, f.mi),
          fin: new Date(f.year, f.mes, f.dia, f.hf, f.mf),
          aula: $scope.actividad.aulas[i]._id
        };
        reservas.data[i] = nuevaReserva;
      }

      console.log(reservas);
      return reservas;
    };

    function obtenerAulas() { // obtengo un array con referencias (_id) a las aulas
      var aulas = [];
      for (var i = 0; i < $scope.actividad.aulas.length; i++) {
        aulas.push($scope.actividad.aulas[i]._id);
      }
      return aulas;
    }

  })

.controller('ModalInstanceCtrl', function($scope, $modalInstance, actividad) {
  $scope.actividad = actividad;
  $scope.selected = {
    //item: $scope.items[0]
  };

  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
