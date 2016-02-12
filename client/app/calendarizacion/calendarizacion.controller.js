'use strict';

angular.module('reservasApp')
  .controller('CalendarizacionCtrl', function(Auth, $rootScope, $scope, $resource, toaster, $compile, $modal, $log, uiCalendarConfig, Events) {
    var DIAS_HABILES = 3;
    var HORA_MINIMO = 6;
    var HORA_MAXIMO = 20;
    var MINUTO_MINIMO = 20;
    var MINUTO_MAXIMO= 15;
    var MINUTO_INTERVALO_MINIMO = 30;
    var MINUTO_INTERVALO_MAXIMO = 300; //5hrs
    var aulasEvt = [];
    var errorDB = false;
    var hoy = new Date();

    $scope.actividad = { // inicializamos la actividad para la reserva
      inicio: new Date(2011, 2, 12, 6, 20, 0),
      fin: new Date(2011, 2, 12, 8, 0, 0)
    };
    $scope.alertOnEventClick = alertOnEventClick;
    $scope.animationsEnabled = true;
    $scope.aprobadosEvt = { //  carga los eventos del dia actual en el web service.
      url: '/api/turnos/estado/aprobados',
      className: 'aprobado',
      startParam: 'inicio',
      endParam: 'fin'
    };
    $scope.aulas = []; // parametro de busqueda por aulas
    $scope.busqueda = {};
    $scope.cargarAulas = cargarAulas;
    $scope.cargarMaterias = cargarMaterias;
    $scope.changed = changed;
    $scope.changeView = changeView;
    $scope.datePicker = {};
    $scope.enviar = enviar;
    $scope.esAdmin = Auth.isAdmin;
    $scope.esDocente = Auth.isDocente;
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
    $scope.esRepresentante = Auth.isRepresentante;
    $scope.eventRender = eventRender;
    $scope.etiquetas = ['Edificio B', 'Edificio C', 'Edificio D']; // parametros de busqueda para reservas
    $scope.eventSources = Events.get();
    $scope.filtroPorAulas = filtroPorAulas;
    $scope.hstep = 1; // horas en el timepicker se desplaza 1 hora
    $scope.ismeridian = false; // no mostrara AM/PM
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.irvan = irvan;
    $scope.loadTags = loadTags;
    $scope.minDate = new Date(hoy);
    $scope.mstep = 5; // minutos en el timepicker se desplaza 5 mins
    $scope.openCalendar = openCalendar;
    $scope.porAulaEvtAprobado = {
      url: '/api/turnos/aulas',
      className: 'aprobado',
      startParam: 'inicio',
      endParam: 'fin',
      data: function() {
        for (var m = 0; m < $scope.aulas.length; m++) {
          aulasEvt[m] = $scope.aulas[m].nombre;
        }
        return {
          _aulas: aulasEvt,
          estado: 'aprobado'
        };
      }
    };
    $scope.porAulaEvtEsperaAdmin = {
      url: '/api/turnos/aulas',
      className: 'espera',
      startParam: 'inicio',
      endParam: 'fin',
      data: function() {
        for (var m = 0; m < $scope.aulas.length; m++) {
          aulasEvt[m] = $scope.aulas[m].nombre;
        }
        return {
          _aulas: aulasEvt,
          estado: 'espera_admin'
        };
      }
    };
    $scope.porAulaEvtEsperaEscuela = {
      url: '/api/turnos/aulas',
      className: 'esperaEscuela',
      startParam: 'inicio',
      endParam: 'fin',
      data: function() {
        for (var m = 0; m < $scope.aulas.length; m++) {
          aulasEvt[m] = $scope.aulas[m].nombre;
        }
        return {
          _aulas: aulasEvt,
          estado: 'espera_escuela'
        };
      }
    };
    $scope.porAulas = porAulas;
    $scope.rellenarDocentes = rellenarDocentes;
    $scope.rellenarMaterias = rellenarMaterias;
    $scope.renderCalender = renderCalender;
    $scope.solicitud = {};
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
        defaultView: 'month',
        allDaySlot: false,
        firstDay: 1,
        lang: 'es',
        firstHour: 8,
        slotMinutes: 20,
        defaultEventMinutes: 120,
        timeFormat: 'HH:mm',
        axisFormat: 'HH:mm',
        minTime: '06:00:00',
        maxTime: '21:00:00',
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      }
    };
    $scope.validarHoraInicio = validarHoraInicio;
    $scope.validarHoraFin = validarHoraFin;

    /////////////////////////////////////////
    (function activate() {
      if (Auth.isAdmin()) {
        $scope.minDate.setDate(hoy.getDate());
      } else {
        $scope.minDate.setDate(hoy.getDate() + DIAS_HABILES);
      }
      $resource('/api/ciclos/por_fecha/actual')
      .get(function(ciclo){
       $scope.cicloActual = ciclo;
      });

    })();
    /////////////////////////////////////////

    function alertOnEventClick(date) {
      console.log(date);
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/app/calendarizacion/reserva-detalle-modal.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          actividad: function() {
            return date;
          }
        }
      });
    }

    function cargarAulas(query) {
      var res = $resource('/api/aulas/nombre/' + query);
      return res.query().$promise;
    }

    function cargarMaterias(query) {
      var res = $resource('/api/materias/nombre/' + query );
      return res.query().$promise;
    }
    function changed() {
      $scope.actividad.fin = $scope.actividad.inicio;
    }

    function changeView(view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    }

    /**
     * Create reserva object from a date
     * @param {Object} f
     * @return {Array} reservas
     */
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
    }

    /**
     * Send the reserva to WebService
     * @param {Object} form
     */
    function enviar(form) {
      $scope.submitted = true;
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
        if ($scope.solicitud.enviarAdmin === true) {
          estado = 'espera_admin';
        } else {
          estado = 'espera_escuela';
        }
        DetectaChoque.save(reservasComprobar).$promise //mandamos las reservas al WS para comprobar choque
          .then(function() {
            encargado = $scope.actividad.docente; // el encargado estara definido en un campo especial
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
            };
            //  console.log(actEnviar);
            $resource('/api/actividades')
              .save(actEnviar).$promise
              .then(function() {
                uiCalendarConfig.calendars.calendario.fullCalendar('refetchEvents');
                toaster.pop('success', 'Éxito', 'La reserva se ha enviado a aprobación');
                $scope.actividad = {};
                $scope.actividad.inicio = nuevoTurno.inicio;
                $scope.actividad.fin = nuevoTurno.fin;
                $scope.submitted = false;
                form.fin.$error.mongoose = false;
                form.inicio.$error.mongoose = false;
                errorDB = false;
                $scope.irvan();
              }, function(err) {
                $scope.errors = {};
                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.data.errors, function(error, field) {
                  form[field].$setValidity('mongoose', false);
                  $scope.errors[field] = error.message;
                });
                errorDB = true;
                toaster.pop('error', 'Error', 'Ha ocurrido un error al enviar');
              });
          }, function(err) {
            toaster.pop('error', 'Error', 'Se ha detectado choque de horarios');
            console.error(err);
          });
      }
    }

    function eventRender(event, element) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    }

    function filtroPorAulas() {
      //console.log($scope.eventSources.length);
      aulasEvt.splice(0, aulasEvt.length);
      // $scope.eventSources.splice(0,$scope.eventSources.length);
      //
      //console.log($scope.eventSources);
      uiCalendarConfig.calendars.calendario.fullCalendar('refetchEvents');
    }

    function irvan() {
      var usuario;
      $scope.mostrar = true;
      if (Auth.isDocente()) {
        usuario = Auth.getCurrentUser();
        $resource('/api/docentes/user/:idUser', {
          idEscuela: '@id'
        }).get({
          idUser: usuario._id
        }, function(docente) {
          $scope.actividad.docente = docente._id;
          $scope.materias = docente.materias;
          $scope.actividad.escuela = docente.escuela;
        });
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
        usuario = Auth.getCurrentUser();
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

    function loadTags() {
      return ['Edificio Electrica', 'Laboratorios UCB', 'Auditorios', 'Edificio Industrial', 'LCOMP', 'BIB', 'Edificio Mecanica'];
    }
    /**
     * Get an Array of ids from aulas $scope
     * @return {Array} aulas
     */
    function obtenerAulas() { // obtengo un array con referencias (_id) a las aulas
      var aulas = [];
      for (var i = 0; i < $scope.actividad.aulas.length; i++) {
        aulas.push($scope.actividad.aulas[i]._id);
      }
      return aulas;
    }

    function openCalendar($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.datePicker.opened = true;
    }

    function porAulas() {
      if ($scope.busqueda.opcion2 === true) {
        $scope.eventSources.splice(0, $scope.eventSources.length); //eliminamos las actuales resources de eventos
        $scope.eventSources.push($scope.porAulaEvtAprobado);
        $scope.eventSources.push($scope.porAulaEvtEsperaAdmin);
        $scope.eventSources.push($scope.porAulaEvtEsperaEscuela);
      } else {
        if ($scope.busqueda.opcion2 === false) {
          $scope.eventSources.splice(0, $scope.eventSources.length);
          $scope.aulas.splice(0, $scope.aulas.length);
          $scope.eventSources.push($scope.aprobadosEvt);
          $scope.eventSources.push($scope.esperaEvt);
	         $scope.eventSources.push($scope.esperaEscuelaEvt);
          aulasEvt.splice(0, aulasEvt.length);
        }
      }
    }

    function rellenarDocentes() {
      $resource('/api/docentes/escuela/:idEscuela', {
          idEscuela: '@id'
        })
        .query({
          idEscuela: $scope.actividad.escuela
        }, function(docentes) {
          $scope.docentes = docentes;
        });
    }

    function rellenarMaterias() {
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

    function validarHoraInicio(){
      var dateAux;
      var horaSeleccionada =  $scope.actividad.inicio.getHours();
      var minutoSeleccionado = $scope.actividad.inicio.getMinutes();
     // validarIntervalo();
      if (horaSeleccionada < HORA_MINIMO){
        dateAux = new Date($scope.actividad.inicio);
        dateAux.setHours(HORA_MINIMO);
        $scope.actividad.inicio =  new Date(dateAux);
      }else{
       if(horaSeleccionada === HORA_MINIMO && minutoSeleccionado < MINUTO_MINIMO){
         dateAux = new Date($scope.actividad.inicio);
         dateAux.setMinutes(MINUTO_MINIMO);
         $scope.actividad.inicio = new Date(dateAux);
       }
      }
    }

    function validarHoraFin(){
     var dateAux;
     var horaSeleccionada =  $scope.actividad.fin.getHours();
     var minutoSeleccionado = $scope.actividad.fin.getMinutes();
   //  validarIntervalo();
     if (horaSeleccionada > HORA_MAXIMO){
       dateAux = new Date($scope.actividad.fin);
       dateAux.setHours(HORA_MAXIMO);
       $scope.actividad.fin =  new Date(dateAux);
     }else{
      if(horaSeleccionada === HORA_MAXIMO && minutoSeleccionado > MINUTO_MAXIMO){
        dateAux = new Date($scope.actividad.fin);
        dateAux.setMinutes(MINUTO_MAXIMO);
        $scope.actividad.inicio = new Date(dateAux);
      }
     }
    }
   /* function validarIntervalo(){
     var dateAux;
     if($scope.actividad.fin - $scope.actividad.inicio < MINUTO_INTERVALO_MINIMO*60*1000){
         dateAux =  new Date($scope.actividad.fin);
         var minAux =  dateAux.getMinutes();
         dateAux.setMinutes(minAux - MINUTO_INTERVALO_MINIMO);
         $scope.actividad.inicio = new Date(dateAux);
      }else{
       if($scope.actividad.fin - $scope.actividad.inicio > MINUTO_INTERVALO_MAXIMO*60*1000){
        dateAux =  new Date($scope.actividad.fin);
        var maxHour =  dateAux.getHours();
        dateAux.setHours(maxHour - 1);
        $scope.actividad.fin =  new Date(dateAux);
       }
      }
    }*/
    function renderCalender(calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    }


  })

.controller('ModalInstanceCtrl', function($scope, $modalInstance, Turno, toaster, actividad, Auth, uiCalendarConfig) {

  $scope.actividad = actividad;
  $scope.esAdmin = Auth.isAdmin;
  $scope.ok = ok;
  $scope.cancelarClase = cancelarClase;
  $scope.cancel = cancel;

  //////////////////////////////////
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function cancelarClase() {
    Turno.delete({
        idTurno: actividad._id
      },
      function() {
        uiCalendarConfig.calendars.calendario.fullCalendar('refetchEvents');
        $modalInstance.close();
        toaster.pop('success', 'Éxito', 'La clase para ese día se ha cancelado');
      },
      function(err) {
        toaster.pop('error', 'Error', 'Ha ocurrido un error, intente mas tarde');
        console.error(err);
      });
  }

  function ok() {
    $modalInstance.close();
  }
});
