import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarPageComponent } from './radar-page.component';

describe('RadarPageComponent', () => {
  let component: RadarPageComponent;
  let fixture: ComponentFixture<RadarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
