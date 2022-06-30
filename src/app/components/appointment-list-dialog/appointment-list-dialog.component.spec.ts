import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListDialogComponent } from './appointment-list-dialog.component';

describe('AppointmentListDialogComponent', () => {
  let component: AppointmentListDialogComponent;
  let fixture: ComponentFixture<AppointmentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
