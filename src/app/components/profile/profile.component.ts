import { SpecialistHoursService } from './../../services/specialist-hours/specialist-hours.service';
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { MedicalRecordService } from 'src/app/services/medical-record/medical-record.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MedicalRecordComponent } from '../medical-record/medical-record.component';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnChanges {
  public eventSettings: EventSettingsModel = {
    fields: {
      id: 'id',
      subject: { name: 'description' },
      startTime: { name: 'startTime' },
      endTime: { name: 'endTime' },
    },
  };
  profile: User | undefined;
  image: string = '';
  startTimes: string[] = [];
  finishTimes: string[] = [];
  selectedSpecialist: string = '';
  scheduleForm = new FormGroup({
    monday: new FormControl(''),
    tuesday: new FormControl(''),
    wednesday: new FormControl(''),
    thursday: new FormControl(''),
    friday: new FormControl(''),
    startTime: new FormControl('', Validators.required),
    finishTime: new FormControl('', Validators.required),
    speciality: new FormControl('', Validators.required),
  });
  constructor(
    public authService: AuthService,
    private storageService: StorageService,
    private scheduleService: SpecialistHoursService,
    private toast: ToastrService,
    public medicalRecordsService: MedicalRecordService,
    public appointmentService: AppointmentsService,
    public userService: UsersService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.scheduleForm.get('startTime')?.value!) {
      const splittedHour = this.scheduleForm.get('startTime')?.value.split(':');
      console.log(splittedHour);
      this.finishTimes = this.createTimes(
        splittedHour[0],
        parseInt(splittedHour[1]) + 30
      );
    }
  }

  async ngOnInit() {
    this.startTimes = this.createTimes(7, 0);
    this.profile = this.authService.getUserData();
    if (this.profile.type === 'paciente') {
      this.medicalRecordsService.loadMedicalRecords(this.profile.email);
      this.userService.getAllSpecialists();
    }
    this.scheduleService.loadHours(this.profile?.email!);
    (await this.storageService.getImgUrl(this.profile?.images[0]!)).subscribe(
      (data) => {
        this.image = data;
      }
    );
  }

  selectSpecialist(specialist: any) {
    this.selectedSpecialist = specialist.value;
  }

  createTimes(hour: number, minutes: number) {
    let times = [];
    if (hour == 17 && minutes == 60) {
      return ['18:00'];
    }
    for (var i = hour; i < 18; ++i) {
      for (var j = i == hour ? Math.ceil(minutes / 30) : 0; j < 2; ++j) {
        times.push((i < 12 ? i % 12 : i) + ':' + (j * 30 || '00'));
      }
    }
    return times;
  }

  onChangeStartTime(hour: any) {
    const splittedHour = hour.value.split(':');
    this.finishTimes = this.createTimes(
      splittedHour[0],
      parseInt(splittedHour[1]) + 30
    );
  }

  onChangeFinishTime(hour: any) {
    this.scheduleForm.setValue({ finishTime: hour.value });
  }

  onChangeSpeciality(speciality: any) {
    this.scheduleForm.setValue({ speciality: speciality.value });
  }

  downloadAppointments() {
    const records = this.medicalRecordsService.medicalRecords;
    const recordsToDownload: any = [];
    Object.keys(records).map((key, index) => {
      if (records[key].specialistEmail === this.selectedSpecialist) {
        recordsToDownload.push(records[key]);
      }
    });
    recordsToDownload.forEach((record: any) => {
      let PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage('../../../assets/logo.png', 'PNG', 10, 10, 50, 50);
      const date = new Date(record.creationDate).toLocaleString();
      PDF.text(`Clínica MediPlus`, 70, 20);
      PDF.text(`Historia clínica de ${record.patientName}`, 70, 30);
      PDF.text(`Atendido por ${record.specialistName}`, 70, 40);
      PDF.text(`Fecha: ${date}`, 70, 50);
      PDF.text(`Altura: ${record.height}cm`, 10, 70);
      PDF.text(`Peso: ${record.weight}kgs`, 10, 80);
      PDF.text(`Temperatura: ${record.temperature}ºC`, 10, 90);
      PDF.text(`Presión: ${record.pressure} (media)`, 10, 100);
      record.firstKey &&
        PDF.text(`${record.firstKey}: ${record.firstKey}`, 10, 110);
      record.secondKey &&
        PDF.text(`${record.secondKey}: ${record.secondKey}`, 10, 120);
      record.thirdKey &&
        PDF.text(`${record.thirdKey}: ${record.thirdKey}`, 10, 130);
      record.fourthKey &&
        PDF.text(`${record.fourthKey}: ${record.fourthKey}`, 10, 140);
      record.fifthKey &&
        PDF.text(`${record.fifthKey}: ${record.fifthKey}`, 10, 150);
      record.sixthKey &&
        PDF.text(`${record.sixthKey}: ${record.sixthKey}`, 10, 160);
      PDF.save(`historia-clínica${record.creationDate}.pdf`);
    });
    this.appointmentService.loadAppointments(
      'especialista',
      this.selectedSpecialist
    );
    setTimeout(() => {
      const appointments = [...this.appointmentService.appointments];
      appointments.forEach((appointment: any) => {
        appointment.startTime = new Date(
          appointment.startTime.seconds * 1000
        ).toLocaleString();
        appointment.endTime = new Date(
          appointment.endTime.seconds * 1000
        ).toLocaleString();
        appointment.creationDate = new Date(
          appointment.creationDate.seconds * 1000
        ).toLocaleString();
        delete appointment.body;
        delete appointment.review;
        delete appointment.isAllDay;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(appointments);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(
        wb,
        `turnos-de-${this.profile?.email}-por-profesional.xlsx`
      );
    }, 1000);
  }

  async confirmHours() {
    try {
      if (!this.scheduleForm.valid) throw new Error();
      const body = {
        [this.scheduleForm.get('speciality')?.value!]: {
          days: {
            monday: this.scheduleForm.get('monday')?.value!,
            tuesday: this.scheduleForm.get('tuesday')?.value!,
            wednesday: this.scheduleForm.get('wednesday')?.value!,
            thursday: this.scheduleForm.get('thursday')?.value!,
            friday: this.scheduleForm.get('friday')?.value!,
          },
          workDays: [
            this.scheduleForm.get('monday')?.value! && 1,
            this.scheduleForm.get('tuesday')?.value! && 2,
            this.scheduleForm.get('wednesday')?.value! && 3,
            this.scheduleForm.get('thursday')?.value! && 4,
            this.scheduleForm.get('friday')?.value! && 5,
          ],
          startTime: this.scheduleForm.get('startTime')?.value!,
          finishTime: this.scheduleForm.get('finishTime')?.value!,
        },
      };
      await this.scheduleService.registerSchedule(this.profile?.email!, body);
    } catch (error) {
      this.toast.error('Todos los campos son requeridos');
    }
  }

  openMedicalRecord(medicalRecord: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = medicalRecord;
    this.dialog.open(MedicalRecordComponent, dialogConfig);
  }
}
