import { SpecialistHoursService } from './../../services/specialist-hours/specialist-hours.service';
import { UsersService } from './../../services/users/users.service';
import { SpecialitiesService } from './../../services/specialities/specialities.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService,
  EventSettingsModel,
  ScheduleComponent,
} from '@syncfusion/ej2-angular-schedule';
import { L10n, loadCldr } from '@syncfusion/ej2-base';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { User } from 'src/app/models/user/user';

declare let require: Function;
loadCldr(
  require('../../../../node_modules/cldr-data/supplemental/numberingSystems.json'),
  require('../../../../node_modules/cldr-data/main/es/ca-gregorian.json'),
  require('../../../../node_modules/cldr-data/main/es/currencies.json'),
  require('../../../../node_modules/cldr-data/main/es/numbers.json'),
  require('../../../../node_modules/cldr-data/main/es/timeZoneNames.json')
);
L10n.load({
  es: {
    schedule: {
      day: 'Día',
      week: 'Semana',
      workWeek: 'Semana laboral',
      month: 'Mes',
      agenda: 'Agenda',
      weekAgenda: 'Agenda semanal',
      workWeekAgenda: 'Agenda de la semana laboral',
      monthAgenda: 'Month Agenda',
      today: 'Hoy',
      noEvents: 'Sin eventos',
      emptyContainer: 'No hay eventos programados para hoy.',
      allDay: 'Todo el día',
      start: 'Inicio',
      end: 'Fin',
      more: 'Más',
      close: 'Cerrar',
      cancel: 'Cancelar',
      noTitle: '(Sin título)',
      delete: 'Borrar',
      deleteEvent: 'Borrar evento',
      deleteMultipleEvent: 'Borrar eventos',
      selectedItems: 'Items seleccionados',
      deleteSeries: 'Borrar series',
      edit: 'Editar',
      editSeries: 'Editar series',
      editEvent: 'Editar evento',
      createEvent: 'Crear',
      subject: 'Título',
      addTitle: 'Añadir título',
      moreDetails: 'Más Detalles',
      save: 'Guardar',
      editContent: '¿Quieres editar sólo este evento o la serie entera?',
      deleteRecurrenceContent:
        '¿Quieres borrar sólo este evento o toda la serie?',
      deleteContent: '¿Estás seguro de que quieres borrar este evento?',
      deleteMultipleContent:
        '¿Estás seguro de que quieres borrar los eventos seleccionados?',
      newEvent: 'Nuevo evento',
      title: 'Título',
      location: 'Ubicación',
      description: 'Descripción',
      timezone: 'Zona horaria',
      startTimezone: 'Zona horaria inicial',
      endTimezone: 'Zona horaria final',
      repeat: 'Repetir',
      saveButton: 'Guardar',
      cancelButton: 'Cancelar',
      deleteButton: 'Borrar',
      recurrence: 'Recurrencia',
      wrongPattern: 'El patrón de recurrencia no es válido.',
      seriesChangeAlert:
        'Los cambios hechos a instancias específicas de esta serie serán cancelados y esos eventos volverán a coincidir con la serie.',
      createError:
        'La duración del evento debe ser más corta que la frecuencia con la que se produce. Acorta la duración o cambia el patrón de recurrencia en el editor de eventos de recurrencia.',
      recurrenceDateValidation:
        'Algunos meses tienen menos de la fecha seleccionada. Para estos meses, la ocurrencia caerá en la última fecha del mes.',
      sameDayAlert:
        'Dos ocurrencias del mismo evento no pueden ocurrir en el mismo día.',
      editRecurrence: 'Editar recurrencia',
      repeats: 'Repeticiones',
      alert: 'Alerta',
      startEndError:
        'La fecha final seleccionada se produce antes de la fecha de inicio.',
      invalidDateError: 'El valor de la fecha introducida no es válido.',
      ok: 'Ok',
      occurrence: 'Occurrencia',
      series: 'Series',
      previous: 'Anterior',
      next: 'Siguiente',
      timelineDay: 'Línea de tiempo diaria',
      timelineWeek: 'Línea de tiempo semanal',
      timelineWorkWeek: 'Línea de tiempo laboral',
      timelineMonth: 'Línea de tiempo mensual',
    },
    recurrenceeditor: {
      none: 'Ninguno',
      daily: 'Diariamente',
      weekly: 'Semanalmente',
      monthly: 'Mensualmente',
      month: 'Mes',
      yearly: 'Anualmente',
      never: 'Nunca',
      until: 'Hasta',
      count: 'Cuenta',
      first: 'Primero',
      second: 'Segundo',
      third: 'Tercero',
      fourth: 'Cuarto',
      last: 'Último',
      repeat: 'Repetir',
      repeatEvery: 'Repetir cada',
      on: 'Repetir en',
      end: 'Fin',
      onDay: 'Día',
      days: 'Día(s)',
      weeks: 'Semana(s)',
      months: 'Mes(es)',
      years: 'Año(s)',
      every: 'cada',
      summaryTimes: 'tiempo(s)',
      summaryOn: 'en',
      summaryUntil: 'hasta',
      summaryRepeat: 'Repeticiones',
      summaryDay: 'día(s)',
      summaryWeek: 'semana(s)',
      summaryMonth: 'mes(es)',
      summaryYear: 'año(s)',
    },
    calendar: {
      today: 'Hoy',
    },
  },
});

@Component({
  selector: 'app-request-appointment',
  templateUrl: './request-appointment.component.html',
  styleUrls: ['./request-appointment.component.css'],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
  ],
})
export class RequestAppointmentComponent implements OnInit {
  public eventSettings: EventSettingsModel = {
    fields: {
      id: 'id',
      subject: { name: 'description' },
      startTime: { name: 'startTime' },
      endTime: { name: 'endTime' },
    },
  };
  appointment: any;
  minDate: Date = new Date();
  maxDate: Date = this.addDays(new Date(), 15);
  days: any[] = [];
  images: any;
  selectedSpecialist: User | undefined;
  selectedSpeciality: string | undefined;
  selectedPatient: User | undefined;

  constructor(
    public specialitiesService: SpecialitiesService,
    public userService: UsersService,
    public scheduleService: SpecialistHoursService,
    private appointmentService: AppointmentsService,
    public authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getDaysArray();
    this.specialitiesService.loadSpecialities();
    this.userService.getAllSpecialists();
    if (this.authService.getUserData().type === 'admin') {
      this.userService.getAllPatients();
    }
    setTimeout(async () => {
      this.userService.specialists.forEach(async (user) => {
        (await this.storageService.getImgUrl(user.images[0])).subscribe(
          (data) => {
            this.images = { ...this.images, [user.email]: data };
          }
        );
      });
    }, 2000);
  }

  addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getDaysArray() {
    let end = this.addDays(new Date(), 15);
    let start = new Date();
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      const dayOfWeek = dt.getDay();
      if (dayOfWeek !== 0) {
        arr.push(
          dt.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        );
      }
    }
    this.days = arr;
  }

  disableButton() {
    return !this.appointment;
  }

  onChangeDate(appointment: any) {
    if (appointment.data) {
      this.appointment = appointment.data[0];
    }
  }

  preventDefault(event: any) {
    if (!event.target || event.target.classList.value === 'e-header-cells') {
      event.cancel = true;
    }
  }

  async selectSpecialist(specialist: User) {
    this.selectedSpecialist = specialist;
    await this.scheduleService.loadHours(specialist.email);
    this.selectedSpeciality = undefined;
  }

  selectSpeciality(speciality: string) {
    this.selectedSpeciality = undefined;
    setTimeout(() => {
      this.selectedSpeciality = speciality;
    }, 100);
  }

  selectPatient(patient: any) {
    this.selectedPatient = patient.value;
  }

  async handleRequestAppointment() {
    const appointment = {
      speciality: this.selectedSpeciality,
      specialistName: `${this.selectedSpecialist?.name} ${this.selectedSpecialist?.lastName}`,
      specialistEmail: this.selectedSpecialist?.email,
      creationDate: new Date(),
      patientEmail:
        this.selectedPatient?.email || this.authService.getUserData().email,
      patientName: this.selectedPatient
        ? `${this.selectedPatient?.name} ${this.selectedPatient.lastName}`
        : `${this.authService.getUserData().name} ${
            this.authService.getUserData().lastName
          }`,
      status: 'Pendiente',
      ...this.appointment,
    };
    await this.appointmentService.registerAppointment(appointment);
    this.appointment = null;
  }
}
