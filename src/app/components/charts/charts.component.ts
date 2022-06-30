import { LogsService } from './../../services/logs/logs.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as Chartist from 'chartist';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData,
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { AppointmentsService } from '../../services/appointments/appointments.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  @ViewChild('logs') logsElement!: ElementRef;
  @ViewChild('bySpeciality') bySpecialityElement!: ElementRef;
  @ViewChild('bySpecialist') bySpecialistElement!: ElementRef;
  @ViewChild('byDay') byDayElement!: ElementRef;
  @ViewChild('byPending') byPendingElement!: ElementRef;
  @ViewChild('byFinished') byFinishedElement!: ElementRef;

  selectedIndex: number = 0;
  data: any;
  from: any;
  to: any;
  result:any;

  options: any = {
    height: 300,
  };
  responsiveOptions: any;

  events: any;
  searched: boolean = false;

  constructor(
    public appointmentService: AppointmentsService,
    public logsService: LogsService
  ) {}

  async ngOnInit() {
    await this.appointmentService.getAllAppointments();
    await this.logsService.getLogs();
  }

  search() {
    if (!this.from || !this.to) return;
    this.searched = true;
    if (this.selectedIndex === 4) {
      this.loadBySpecialistPending();
    }
    if (this.selectedIndex === 5) {
      this.loadBySpecialistFinished();
    }
  }

  download(value: string) {
    switch (value) {
      case 'logs':
        html2canvas(this.logsElement.nativeElement, { scale: 3 }).then(
          (canvas) => {
            const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
            const fileWidth = 200;
            const generatedImageHeight =
              (canvas.height * fileWidth) / canvas.width;
            let PDF = new jsPDF('p', 'mm', 'a4');
            PDF.addImage(
              imageGeneratedFromTemplate,
              'PNG',
              0,
              5,
              fileWidth,
              generatedImageHeight
            );
            PDF.html(this.logsElement.nativeElement.innerHTML);
            PDF.save('logs-ingreso.pdf');
          }
        );
        break;
      default:
        const users = [...this.result];
        users.forEach((user:any) => {
          user.creationDate = new Date(user.creationDate.seconds*1000).toLocaleString();
          user.endTime = new Date(user.endTime.seconds*1000).toLocaleString();
          user.startTime = new Date(user.startTime.seconds*1000).toLocaleString();
        })
        const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(users);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `lista-turnos-${value}.xlsx`);
        break;
    }
  }

  fromChange(event: any) {
    this.searched = false;
    this.from = event.value;
  }

  toChange(event: any) {
    this.searched = false;
    this.to = event.value;
  }

  loadBySpecialistFinished() {
    if (!this.from || !this.to) return;
    this.result = [];
    const specialit = this.appointmentService.appointments.reduce(
      (r: any, a: any) => {
        const date = new Date(a.creationDate.seconds * 1000);
        if (
          a.status === 'Terminado' &&
          date > new Date(this.from) &&
          date < new Date(this.to)
          ) {
          this.result.push(a);
          r[a.specialistName] = r[a.specialistName] || [];
          r[a.specialistName].push(a);
        }
        return r;
      },
      Object.create(null)
    );
    let labels: any = [];
    let series: any = [[], []];
    Object.keys(specialit).map((key, index) => {
      labels.push(key);
      series[0].push(specialit[key].length);
      // series[1].push(specialit[key].length);
    });
    const data = {
      labels,
      series,
    };
    this.data = data;
    this.options = {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
      },
    };
    this.events = {
      draw: (data: any) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px',
          });
          data.element.animate({
            y2: <IChartistAnimationOptions>{
              dur: '1s',
              from: data.y1,
              to: data.y2,
              easing: 'easeOutQuad',
            },
          });
        }
      },
    };
  }

  loadBySpecialistPending() {
    if (!this.from || !this.to) return;
    this.result = [];
    const specialit = this.appointmentService.appointments.reduce(
      (r: any, a: any) => {
        const date = new Date(a.creationDate.seconds * 1000);
        if (date > new Date(this.from) && date < new Date(this.to)) {
          this.result.push(a);
          r[a.specialistName] = r[a.specialistName] || [];
          r[a.specialistName].push(a);
        }
        return r;
      },
      Object.create(null)
    );
    let labels: any = [];
    let series: any = [[], []];
    Object.keys(specialit).map((key, index) => {
      labels.push(key);
      series[0].push(specialit[key].length);
      // series[1].push(specialit[key].length);
    });
    const data = {
      labels,
      series,
    };
    this.data = data;
    this.options = {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
      },
    };
    this.events = {
      draw: (data: any) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px',
          });
          data.element.animate({
            y2: <IChartistAnimationOptions>{
              dur: '1s',
              from: data.y1,
              to: data.y2,
              easing: 'easeOutQuad',
            },
          });
        }
      },
    };
  }

  loadBySpecialist() {
    this.result = [];
    const specialit = this.appointmentService.appointments.reduce(
      (r: any, a: any) => {
        this.result.push(a);
        r[a.specialistName] = r[a.specialistName] || [];
        r[a.specialistName].push(a);
        return r;
      },
      Object.create(null)
    );
    let labels: any = [];
    let series: any = [[], []];
    Object.keys(specialit).map((key, index) => {
      labels.push(key);
      series[0].push(specialit[key].length);
      // series[1].push(specialit[key].length);
    });
    const data = {
      labels,
      series,
    };
    this.options = {
      height: 300,
    };
    this.data = data;
    this.events = {
      draw: (data: any) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px',
          });
          data.element.animate({
            y2: <IChartistAnimationOptions>{
              dur: '1s',
              from: data.y1,
              to: data.y2,
              easing: 'easeOutQuad',
            },
          });
        }
      },
    };
  }

  loadBySpeciality() {
    this.result=[]
    const speciality = this.appointmentService.appointments.reduce(
      (r: any, a: any) => {
        this.result.push(a);
        r[a.speciality] = r[a.speciality] || [];
        r[a.speciality].push(a);
        return r;
      },
      Object.create(null)
    );
    let labels: any = [];
    let series: any = [[], []];
    Object.keys(speciality).map((key, index) => {
      labels.push(key);
      series[0].push(speciality[key].length);
      // series[1].push(specialit[key].length);
    });
    const data = {
      labels,
      series,
    };
    this.options = {
      height: 300,
    };
    this.data = data;
    this.events = {
      draw: (data: any) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px',
          });
          data.element.animate({
            y2: <IChartistAnimationOptions>{
              dur: '1s',
              from: data.y1,
              to: data.y2,
              easing: 'easeOutQuad',
            },
          });
        }
      },
    };
  }

  loadByDay() {
    this.result=[]
    const days = this.appointmentService.appointments.reduce(
      (r: any, a: any) => {
        this.result.push(a);
        const date = new Date(a.creationDate.seconds * 1000).getDay();
        const dateLabels: any = {
          1: 'Lunes',
          2: 'Martes',
          3: 'Miércoles',
          4: 'Jueves',
          5: 'Viernes',
          6: 'Sábado',
        };
        r[dateLabels[date]] = r[dateLabels[date]] || [];
        r[dateLabels[date]].push(a);
        return r;
      },
      Object.create(null)
    );
    let labels: any = [];
    let series: any = [[]];
    const datePosition: any = {
      Lunes: 0,
      Martes: 1,
      Miércoles: 2,
      Jueves: 3,
      Viernes: 4,
      Sabado: 5,
    };
    Object.keys(days).map((key, index) => {
      labels[datePosition[key]] = key;
      series[0][datePosition[key]] = days[key].length;
    });
    const data = {
      labels,
      series,
    };
    this.options = {
      fullWidth: true,
      chartPadding: {
        right: 40,
      },
    };
    this.data = data;
    this.events = {
      draw: (data: any) => {
        data.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: '1s',
            from: data.y1,
            to: data.y2,
            easing: 'easeOutQuad',
          },
        });
      },
    };
  }

  changes(event: any) {
    this.selectedIndex = event.index;
    this.data = null;
    switch (event.index) {
      case 0:
        break;
      case 1:
        this.loadBySpeciality();
        break;
      case 2:
        this.loadBySpecialist();
        break;
      case 3:
        this.loadByDay();
        break;
      default:
        break;
    }
  }
}
