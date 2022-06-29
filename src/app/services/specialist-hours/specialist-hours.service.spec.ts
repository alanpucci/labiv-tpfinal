import { TestBed } from '@angular/core/testing';

import { SpecialistHoursService } from './specialist-hours.service';

describe('SpecialistHoursService', () => {
  let service: SpecialistHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialistHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
