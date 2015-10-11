'use strict';

angular.module('reservasApp')

.constant('CalendarioEs',{
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
        eventClick: '$scope.alertOnEventClick',
        eventDrop: '$scope.alertOnDrop',
        eventResize: '$scope.alertOnResize',
        eventRender: '$scope.eventRender',
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
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      }
  
 
});
