import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymClassManagement } from './gym-class-management';

describe('GymClassManagement', () => {
  let component: GymClassManagement;
  let fixture: ComponentFixture<GymClassManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymClassManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymClassManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
